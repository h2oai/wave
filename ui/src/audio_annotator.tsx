import * as Fluent from '@fluentui/react'
import { B, F, Id, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { averageChannels } from './parts/audioUtils'
import { DrawnAnnotation, RangeAnnotator, TimeComponent } from './parts/range_annotator'
import { AnnotatorTags } from './text_annotator'
import { clas, cssVar } from './theme'
import { wave } from './ui'

/** Create a unique tag type for use in an audio annotator. */
export interface AudioAnnotatorTag {
  /** An identifying name for this tag. */
  name: Id
  /** Text to be displayed for the annotation. */
  label: S
  /** Hex or RGB color string to be used as the background color. */
  color: S
}

/** Create an annotator item with initial selected tags or no tags. */
export interface AudioAnnotatorItem {
  /** The start of the audio annotation in seconds. */
  start: F
  /** The end of the audio annotation in seconds. */
  end: F
  /** The `name` of the audio annotator tag to refer to for the `label` and `color` of this item. */
  tag: S
}

/**
 * Create an audio annotator component.
 * 
 * This component allows annotating and labeling parts of audio file.
 */
export interface AudioAnnotator {
  /** An identifying name for this component. */
  name: Id,
  /** The audio annotator's title. */
  title: S
  /** The path to the audio file. Use mp3 or wav formats to achieve the best cross-browser support. See https://caniuse.com/?search=audio%20format for other formats. */
  path: S
  /** The master list of tags that can be used for annotations. */
  tags: AudioAnnotatorTag[]
  /** Annotations to display on the image, if any. */
  items?: AudioAnnotatorItem[]
  /** True if the form should be submitted as soon as an annotation is made. */
  trigger?: B
}

const
  WAVEFORM_HEIGHT = 200,
  BODY_MIN_HEGHT = 370,
  css = stylesheet({
    body: {
      minHeight: BODY_MIN_HEGHT,
    },
    title: {
      color: cssVar('$neutralPrimary'),
      marginBottom: 8
    },
    waveForm: {
      position: 'absolute',
      top: 0,
      width: '100%',
      height: WAVEFORM_HEIGHT,
      cursor: 'pointer'
    },
  }),
  speedAdjustmentOptions = [
    { key: 0.25, text: '0.25x' },
    { key: 0.5, text: '0.5x' },
    { key: 0.75, text: '0.75x' },
    { key: 1, text: 'Normal' },
    { key: 1.25, text: '1.25x' },
    { key: 1.5, text: '1.5x' },
    { key: 2, text: '2x' },
  ],
  // Love ya Safari.
  promisifyDecodeAudioData = (audioContext: AudioContext, audioData: ArrayBuffer) => new Promise<AudioBuffer>((resolve, reject) => {
    audioContext.decodeAudioData(audioData, resolve, reject)
  })

declare global {
  interface Window { webkitAudioContext: typeof window.AudioContext }
}
// Shim for AudioContext in Safari.
window.AudioContext = window.AudioContext || window.webkitAudioContext

export const XAudioAnnotator = ({ model }: { model: AudioAnnotator }) => {
  const
    [activeTag, setActiveTag] = React.useState(model.tags[0]?.name),
    [waveFormData, setWaveFormData] = React.useState<Float32Array | null>(null),
    [isPlaying, setIsPlaying] = React.useState(false),
    [duration, setDuration] = React.useState(0),
    [currentTime, setCurrentTime] = React.useState(0),
    [volumeIcon, setVolumeIcon] = React.useState('Volume3'),
    [loadingMsg, setLoadingMsg] = React.useState(''),
    [errMsg, setErrMsg] = React.useState(''),
    audioRef = React.useRef<HTMLAudioElement>(null),
    audioContextRef = React.useRef<AudioContext>(),
    skipNextDurationOffsetRef = React.useRef(false),
    gainNodeRef = React.useRef<GainNode>(),
    fetchedAudioUrlRef = React.useRef<S>(),
    activateTag = (tagName: S) => () => setActiveTag(tagName),
    // TODO: Move to a separate service worker.
    getAudioData = async () => {
      if (!audioRef.current) return

      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      gainNodeRef.current = audioContext.createGain()

      audioContext.createMediaElementSource(audioRef.current)
        .connect(gainNodeRef.current)
        .connect(audioContext.destination)

      setLoadingMsg('Fetching audio data...')
      let arrBuffer: ArrayBuffer
      try {
        // The data audio needs to be fetched and processed manually to generate a waveform later.
        const res = await fetch(model.path)
        arrBuffer = await res.arrayBuffer()
      } catch (e) {
        setErrMsg('Could not download audio file.')
        return
      }
      // Store the URL into the ref so that it can be revoked on destroy and mem leak prevented.
      // Safari needs Blob type to be specified, doesn't need to match the real sound format.
      fetchedAudioUrlRef.current = URL.createObjectURL(new Blob([arrBuffer], { type: 'audio/mpeg' }))
      // Do not set src directly within HTML to prevent double fetching.
      audioRef.current.src = fetchedAudioUrlRef.current

      setLoadingMsg('Decoding audio data...')
      let audioBuffer: AudioBuffer
      try {
        audioBuffer = await promisifyDecodeAudioData(audioContext, arrBuffer)
      } catch (e) {
        setErrMsg('Could not decode audio data. The file is either corrupted or the format is not supported.')
        return
      }
      const channel2 = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : undefined
      setWaveFormData(averageChannels(audioBuffer.getChannelData(0), channel2))
      setDuration(audioBuffer.duration)
      setLoadingMsg('')
    },
    updateTrack = (audioEl: HTMLAudioElement) => {
      // We need higher frequency than HTMLAudioELEMENT's onTimeUpdate provides.
      window.requestAnimationFrame(() => {
        skipNextDurationOffsetRef.current = false
        setCurrentTime(audioEl.currentTime)
        setIsPlaying(isPlaying => {
          if (isPlaying) updateTrack(audioEl)
          return isPlaying
        })
      })
    },
    onPlayerStateChange = () => {
      const audioContext = audioContextRef.current
      const audioEl = audioRef.current
      if (!audioContext || !audioEl) return
      if (audioContext.state === 'suspended') audioContext.resume()

      setIsPlaying(isPlaying => !isPlaying)
      if (isPlaying) audioEl.pause()
      else {
        audioEl.play()
        updateTrack(audioEl)
      }
    },
    onAudioEnded = () => setIsPlaying(false),
    onTrackChange = (value: F, _range?: [F, F]) => {
      skipNextDurationOffsetRef.current = true
      skipToTime(value)()
    },
    onVolumeChange = (v: F) => {
      if (gainNodeRef.current) gainNodeRef.current.gain.value = v
      setVolumeIcon(v === 0 ? 'VolumeDisabled' : (v < 0.3 ? 'Volume1' : (v < 0.75 ? 'Volume2' : 'Volume3')))
    },
    onSpeedChange = (v: U) => { if (audioRef.current) audioRef.current.playbackRate = v },
    skipToTime = (newTime: F) => () => {
      if (!audioRef.current) return
      setCurrentTime(newTime)
      audioRef.current.currentTime = newTime
    },
    onAnnotate = React.useCallback((newAnnotations: DrawnAnnotation[]) => {
      const annotations = []
      for (let i = 0; i < newAnnotations.length; i++) {
        const { start, end, tag, isZoom } = newAnnotations[i]
        if (!isZoom) annotations.push({ start, end, tag })
      }
      wave.args[model.name] = annotations
      if (model.trigger) wave.push()
    }, [model.name, model.trigger])

  React.useEffect(() => {
    getAudioData()
    wave.args[model.name] = (model.items as unknown as Rec[]) || []
    return () => { if (fetchedAudioUrlRef.current) URL.revokeObjectURL(fetchedAudioUrlRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div data-test={model.name} className={css.body}>
      <div className={clas('wave-s16 wave-w6', css.title)}>{model.title}</div>
      <audio hidden ref={audioRef} onEnded={onAudioEnded}></audio>
      {
        waveFormData ? (
          <>
            <AnnotatorTags tags={model.tags} activateTag={activateTag} activeTag={activeTag} />
            <RangeAnnotator
              items={model.items}
              onAnnotate={onAnnotate}
              activeTag={activeTag}
              tags={model.tags}
              trackPosition={currentTime / duration}
              duration={duration}
              setActiveTag={setActiveTag}
              onRenderToolbar={() => (
                <Fluent.Stack horizontal>
                  <Fluent.Icon iconName={volumeIcon} styles={{ root: { fontSize: 18 } }} />
                  <Fluent.Slider
                    styles={{ root: { minWidth: 180 } }}
                    defaultValue={1}
                    max={2}
                    step={0.01}
                    onChange={onVolumeChange}
                    showValue={false}
                  />
                  <Fluent.Icon iconName='PlaybackRate1x' styles={{ root: { marginTop: 3, marginLeft: 6, fontSize: 18 } }} />
                  <Fluent.Dropdown
                    title='Playback speed'
                    styles={{ title: { border: 'none', }, dropdown: { selectors: { ':focus::after': { border: 'none' } }, minWidth: 70 } }}
                    defaultSelectedKey={audioRef?.current?.playbackRate || 1}
                    options={speedAdjustmentOptions}
                    onChange={(_ev, option) => onSpeedChange(option!.key as U)}
                  />
                </Fluent.Stack>
              )}
              backgroundData={waveFormData}
            />
            <Fluent.Slider
              styles={{ root: { minWidth: 180 }, slideBox: { padding: 0 } }}
              // HACK: React doesn't allow for skipping batch updates in 3rd party components. 
              // Add a small offset to sync canvas and slider tracks.
              value={currentTime + (isPlaying && !skipNextDurationOffsetRef.current ? 0.05 : 0)}
              max={duration}
              step={0.01}
              onChange={onTrackChange}
              showValue={false}
            />
            <div style={{ marginBottom: 8 }}>
              <TimeComponent secs={currentTime} isBig />
            </div>
            <Fluent.Stack horizontal horizontalAlign='center'>
              <Fluent.IconButton iconProps={{ iconName: 'PlayReverseResume' }} styles={{ icon: { fontSize: 18 } }} onClick={skipToTime(0)} />
              <Fluent.IconButton
                iconProps={{ iconName: isPlaying ? 'Pause' : 'PlaySolid' }}
                onClick={onPlayerStateChange}
                styles={{
                  root: { backgroundColor: cssVar('$themePrimary'), borderRadius: 50, marginTop: 1.5 },
                  rootHovered: { backgroundColor: cssVar('$themeSecondary') },
                  rootPressed: { backgroundColor: cssVar('$themeSecondary') },
                  icon: { marginBottom: 2, color: cssVar('$white'), fontSize: 18 }
                }}
              />
              <Fluent.IconButton iconProps={{ iconName: 'PlayResume' }} styles={{ icon: { fontSize: 18 } }} onClick={skipToTime(duration)} />
            </Fluent.Stack>
          </>
        ) : (
          <Fluent.Stack horizontalAlign='center' verticalAlign='center' styles={{ root: { minHeight: BODY_MIN_HEGHT } }}>
            {errMsg
              ? (
                <>
                  <Fluent.Icon iconName='Error' styles={{ root: { fontSize: 48, color: cssVar('$errorText'), marginBottom: 15 } }} />
                  <Fluent.Text >{errMsg}</Fluent.Text>
                </>
              )
              : <Fluent.Spinner size={Fluent.SpinnerSize.large} label={loadingMsg} />}

          </Fluent.Stack>
        )
      }
    </div >
  )
}