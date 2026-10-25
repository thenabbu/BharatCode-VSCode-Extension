import { type Component, type JSX, createSignal, For, Show } from "solid-js"
import { Icon } from "@kilocode/kilo-ui/icon"
import { BharatCodeMark } from "../brand/BharatCodeMark"
import { useDialog } from "@kilocode/kilo-ui/context/dialog"
import { useSession } from "../../context/session"
import { useProvider } from "../../context/provider"
import { useVSCode } from "../../context/vscode"
import { useLanguage } from "../../context/language"
import { recentSessions } from "../../context/session-utils"
import type { SessionInfo } from "../../types/messages"
import { formatRelativeDate } from "../../utils/date"
import { FeedbackDialog } from "./FeedbackDialog"
import { WorkspaceScopeHint } from "./WorkspaceScopeHint"

interface WelcomeEmptyStateProps {
  sessions?: () => SessionInfo[]
  onSelectSession?: (id: string) => void
  onShowHistory?: () => void
  footer?: JSX.Element
}

/**
 * Square BharatCode mark. Hover rotates the mark 90°.
 */
export const KiloLogo = () => {
  const [hover, setHover] = createSignal(false)

  return (
    <div
      class="kilo-logo"
      classList={{ "kilo-logo-hover": hover() }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div class="kilo-logo-layer kilo-logo-static">
        <BharatCodeMark />
      </div>
    </div>
  )
}

export const WelcomeEmptyState: Component<WelcomeEmptyStateProps> = (props) => {
  const session = useSession()
  const language = useLanguage()
  const dialog = useDialog()
  const provider = useProvider()
  const vscode = useVSCode()
  const recent = () => recentSessions(props.sessions?.() ?? session.sessions())
  // A new user sees this screen before any provider exists: offer the one
  // action that starts the extension instead of an empty chat box.
  const needsConnect = () => !provider.connected().includes("bharatcode")

  return (
    <div class="message-list-empty">
      <KiloLogo />
      <p class="kilo-about-text">{language.t("session.messages.welcome")}</p>
      <Show when={needsConnect()}>
        <div class="welcome-onboarding" role="region" aria-label={language.t("session.onboarding.title")}>
          <div class="welcome-onboarding-heading">
            <Icon name="account" size="small" />
            <span>{language.t("session.onboarding.title")}</span>
          </div>
          <p class="welcome-onboarding-body">{language.t("session.onboarding.body")}</p>
          <button class="welcome-connect" onClick={() => vscode.postMessage({ type: "connectBharatcode" })}>
            {language.t("session.messages.connect")}
          </button>
          <p class="welcome-onboarding-hint">{language.t("session.onboarding.hint")}</p>
        </div>
      </Show>
      <WorkspaceScopeHint />
      <Show when={recent().length > 0 && props.onSelectSession}>
        <div class="recent-sessions">
          <span class="recent-sessions-label">{language.t("session.recent")}</span>
          <For each={recent()}>
            {(item) => (
              <button class="recent-session-item" onClick={() => props.onSelectSession?.(item.id)}>
                <span class="recent-session-title" dir="auto">
                  {item.title || language.t("session.untitled")}
                </span>
                <span class="recent-session-date">{formatRelativeDate(item.updatedAt)}</span>
              </button>
            )}
          </For>
          <Show when={props.onShowHistory}>
            <button class="show-history-btn" onClick={() => props.onShowHistory?.()}>
              <Icon name="history" size="small" />
              {language.t("session.showHistory")}
            </button>
          </Show>
        </div>
      </Show>
      <button class="feedback-button" onClick={() => dialog.show(() => <FeedbackDialog />)}>
        <Icon name="bubble-5" size="small" />
        {language.t("feedback.button")}
      </button>
      {props.footer}
    </div>
  )
}
