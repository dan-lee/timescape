// Check out the './integrations' folder for the demo code of the different integrations

import { useEffect, useRef, useState } from 'react'
import './IntegrationDemo.css'

const IntegrationDemo = () => {
  const renderTargetRef = useRef<HTMLDivElement>(null)
  const unmountRef = useRef<() => void>()
  const [integration, setIntegration] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const integration = urlParams.get('value')
    integration && setIntegration(integration)
  }, [])

  useEffect(() => {
    if (!integration) return

    unmountRef.current?.()

    switch (integration) {
      case 'react':
      case 'preact':
      case 'vue':
      case 'svelte':
      case 'solid':
      case 'vanilla':
        const ext = integration === 'react' ? 'tsx' : 'ts'
        import(`./integrations/${integration}.${ext}`)
          .then(({ renderTo }) => {
            if (!renderTargetRef.current) return
            unmountRef.current = renderTo(renderTargetRef.current)
          })
          .catch((err) => {
            console.error('Failed to load integration', err)
          })
        break
      default:
        alert('Integration not implemented')
        return
    }
  }, [integration])

  return <div ref={renderTargetRef} />
}

export default IntegrationDemo
