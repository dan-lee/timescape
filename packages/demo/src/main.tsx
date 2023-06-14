import { createRoot } from 'react-dom/client'
import IntegrationDemo from './IntegrationDemo.tsx'
import './main.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <IntegrationDemo />,
)
