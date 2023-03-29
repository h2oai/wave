import * as Fluent from '@fluentui/react'
import { B, F, Id, Rec, S, U } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { MicroBars } from './parts/microbars'
import { DrawnAnnotation, formatTime, RangeAnnotator } from './parts/range_annotator'
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
  /** The source of the audio. We advise using mp3 or wav formats to achieve the best cross-browser experience. See https://caniuse.com/?search=audio%20format for other formats. */
  src: S
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
  ]

declare global {
  interface Window { webkitAudioContext: typeof window.AudioContext }
}
// Shim for AudioContext in Safari.
window.AudioContext = window.AudioContext || window.webkitAudioContext

export const XAudioAnnotator = ({ model }: { model: AudioAnnotator }) => {
  const
    [activeTag, setActiveTag] = React.useState(model.tags[0]?.name),
    [waveFormData, setWaveFormData] = React.useState<{ val: U, cat: U }[] | null>(null),
    [isPlaying, setIsPlaying] = React.useState(false),
    [duration, setDuration] = React.useState(0),
    [currentTime, setCurrentTime] = React.useState(0),
    [volumeIcon, setVolumeIcon] = React.useState('Volume3'),
    audioRef = React.useRef<HTMLAudioElement>(null),
    audioContextRef = React.useRef<AudioContext>(),
    gainNodeRef = React.useRef<GainNode>(),
    fetchedAudioUrlRef = React.useRef<S>(),
    audioPositionIntervalRef = React.useRef<U>(),
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

      // The data audio needs to be fetched and processed manually to generate a waveform later.
      const res = await fetch(model.src)
      const arrBuffer = await res.arrayBuffer()
      // Store the URL into the ref so that it can be revoked on destroy and mem leak prevented.
      fetchedAudioUrlRef.current = URL.createObjectURL(new Blob([arrBuffer]))
      // Do not set src directly within HTML to prevent double fetching.
      audioRef.current.src = fetchedAudioUrlRef.current

      const audioBuffer = await audioContext.decodeAudioData(arrBuffer)
      const rawData = audioBuffer.getChannelData(0) // We only need to work with one channel of data

      // TODO: Compute samples dynamically based on available width.
      const samples = 300
      const blockSize = Math.floor(rawData.length / samples)
      const filteredData = new Array(samples)
      for (let i = 0; i < samples; i++) {
        const blockStart = blockSize * i // the location of the first sample in the block
        let sum = 0
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
        }
        filteredData[i] = sum / blockSize // divide the sum by the block size to get the average
      }
      const multiplier = Math.pow(Math.max(...filteredData), -1)
      setWaveFormData(filteredData.map(n => ({ val: n * multiplier, cat: n * multiplier * 100 })))
      setDuration(audioBuffer.duration)
    },
    onPlayerStateChange = () => {
      const audioContext = audioContextRef.current
      const audioEl = audioRef.current
      if (!audioContext || !audioEl) return
      if (audioContext.state === 'suspended') audioContext.resume()

      if (isPlaying) {
        audioEl.pause()
        if (audioPositionIntervalRef.current) window.clearInterval(audioPositionIntervalRef.current)
      }
      else {
        audioEl.play()
        // We need higher frequency than HTMLAudioELEMENT's onTimeUpdate provides.
        // TODO: Think about whether requestAnimationFrame would make more sense here.
        audioPositionIntervalRef.current = window.setInterval(() => setCurrentTime(audioEl.currentTime), 10)
      }
      setIsPlaying(isPlaying => !isPlaying)
    },
    onAudioEnded = () => {
      setIsPlaying(false)
      if (audioPositionIntervalRef.current) window.clearInterval(audioPositionIntervalRef.current)
    },
    onTrackChange = (value: F, _range?: [F, F], e?: unknown) => {
      skipToTime(value)(e as any)
    },
    onVolumeChange = (v: F) => {
      if (gainNodeRef.current) gainNodeRef.current.gain.value = v
      setVolumeIcon(v === 0 ? 'VolumeDisabled' : (v < 0.3 ? 'Volume1' : (v < 0.75 ? 'Volume2' : 'Volume3')))
    },
    onSpeedChange = (v: U) => { if (audioRef.current) audioRef.current.playbackRate = v },
    skipToTime = (newTime?: F) => (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!audioRef.current) return
      if (newTime === undefined) {
        const xRelativeToCurrTarget = (e.pageX || 0) - e.currentTarget.getBoundingClientRect().left
        newTime = xRelativeToCurrTarget / e.currentTarget.width * duration
      }
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
    return () => {
      if (fetchedAudioUrlRef.current) URL.revokeObjectURL(fetchedAudioUrlRef.current)
      if (audioPositionIntervalRef.current) window.clearInterval(audioPositionIntervalRef.current)
    }
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
              percentPlayed={currentTime / duration}
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
            >
              <MicroBars data={waveFormData} value='val' category='cat' color='$themePrimary' zeroValue={0} />
            </RangeAnnotator>
            <Fluent.Slider
              styles={{ root: { minWidth: 180 }, slideBox: { padding: 0 } }}
              value={currentTime}
              max={duration}
              step={0.01}
              onChange={onTrackChange}
              showValue={false}
            />
            <div style={{ position: 'relative' }}>
              <Fluent.Stack horizontal styles={{ root: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', marginTop: 25 } }}>
                <Fluent.IconButton iconProps={{ iconName: 'PlayReverseResume' }} styles={{ icon: { fontSize: 18 } }} onClick={skipToTime(0)} />
                <Fluent.IconButton
                  iconProps={{ iconName: isPlaying ? 'Pause' : 'PlaySolid' }}
                  onClick={onPlayerStateChange}
                  styles={{
                    root: { backgroundColor: cssVar('$themePrimary'), borderRadius: 50 },
                    rootHovered: { backgroundColor: cssVar('$themeSecondary') },
                    icon: { marginBottom: 2, color: cssVar('$white'), fontSize: 18 }
                  }}
                />
                <Fluent.IconButton
                  iconProps={{ iconName: 'PlayResume' }}
                  styles={{ icon: { fontSize: 18 } }}
                  onClick={skipToTime(duration)}
                />
              </Fluent.Stack>
              <div style={{ textAlign: 'center' }}>{formatTime(currentTime)} </div>
            </div>
          </>
        ) : (
          <Fluent.Stack horizontalAlign='center' verticalAlign='center' styles={{ root: { minHeight: BODY_MIN_HEGHT } }}>
            <Fluent.Spinner size={Fluent.SpinnerSize.large} label='Loading audio annotator' />
          </Fluent.Stack>
        )
      }
    </div >
  )
}