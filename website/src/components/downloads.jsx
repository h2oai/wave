import React from 'react'

export const Downloads = () => {
  const [items, setItems] = React.useState([])
  const isDestroyed = React.useRef(false)
  const mapToLink = ({ Key }) => <div key={Key}><a href={`https://h2o-wave.s3.amazonaws.com/${Key}`}>{Key.replace('releases/', '')}</a></div>
  React.useEffect(() => {
    new AWS
      .S3({ region: 'us-east-1', params: { Bucket: 'h2o-wave' } })
      .makeUnauthenticatedRequest('listObjects', (err, data) => {
        if (err) throw new Error(err)
        const files = data.Contents.filter(({ Key }) => Key !== 'releases/' && !Key.endsWith('index.html'))
        if (!isDestroyed.current) {
          setItems([  
            files.filter(({ Key }) => Key.endsWith('.gz') && Key.includes('wave-')).reverse(),
            files.filter(({ Key }) => Key.endsWith('.whl') && Key.includes('wave-')).reverse(),
            files.filter(({ Key }) => Key.endsWith('.gz') && Key.includes('_R')).reverse(),
            files.filter(({ Key }) => Key.endsWith('.gz') && Key.includes('wavedb-')).reverse()
          ])
        }
      })
    return () => isDestroyed.current = true
  }, [])
  return items.length
    ? (
      <>
        <h4>Wave server</h4>
        {items[0].map(mapToLink)}
        <h4>Python client</h4>
        {items[1].map(mapToLink)}
        <h4>R client</h4>
        {items[2].map(mapToLink)}
        <h4>WaveDB</h4>
        {items[3].map(mapToLink)}
      </>
    )
    : 'Loading...'
}
