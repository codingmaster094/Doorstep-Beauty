'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Overlay'
import { InstallIcon } from '@/components/ui/Icons'
import type { BeforeInstallPromptEvent } from '@/types/pwa'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function InstallAppButton({ variant = 'icon' }: { variant?: 'icon' | 'menu' }) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    setInstalled(isStandalone())
    const onPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      setPromptEvent(event)
    }
    const onInstalled = () => {
      setInstalled(true)
      setPromptEvent(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) return null

  async function onInstall() {
    if (promptEvent) {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
      setPromptEvent(null)
      return
    }
    setHelpOpen(true)
  }

  const ios = typeof navigator !== 'undefined' && isIos()

  return (
    <>
      {variant === 'icon' ? (
        <button type="button" className="salon-nav-btn" aria-label="Install app" onClick={onInstall}>
          <InstallIcon className="h-5 w-5" />
        </button>
      ) : (
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-between border-b border-line/70 py-3 text-left text-sm tracking-wide"
          onClick={onInstall}
        >
          Install app
        </button>
      )}
      <Modal open={helpOpen} title="Install app" onClose={() => setHelpOpen(false)}>
        {ios ? (
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-ink-soft">
            <li>Safariમાં નીચે Share બટન દબાવો.</li>
            <li>Add to Home Screen પસંદ કરો.</li>
            <li>Add દબાવો — phoneની screen પર app icon આવશે.</li>
          </ol>
        ) : (
          <p className="text-sm leading-7 text-ink-soft">
            Chromeમાં આ website ખોલો, પછી browser menuમાં Install app અથવા Add to Home screen પસંદ કરો. Android પર headerના install iconથી સીધું install થઈ શકે છે.
          </p>
        )}
        <Button className="mt-5 w-full" onClick={() => setHelpOpen(false)}>
          Got it
        </Button>
      </Modal>
    </>
  )
}
