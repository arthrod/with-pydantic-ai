import React, { useEffect } from "react";
import { Severity, CopilotKitError } from "@copilotkit/shared";
import { StatusChecker } from "../../lib/status-checker";
import { getErrorActions, UsageBanner } from "../usage-banner";
import { useErrorToast } from "./error-utils";

const statusChecker = new StatusChecker();

interface Props {
  children: React.ReactNode;
  publicApiKey?: string;
  showUsageBanner?: boolean;
}

interface State {
  hasError: boolean;
  error?: CopilotKitError;
  status?: {
    severity: Severity;
    message: string;
  };
}

export class CopilotErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: CopilotKitError): State {
    return { hasError: true, error };
  }

  componentDidMount() {
    if (this.props.publicApiKey) {
      statusChecker.start(this.props.publicApiKey, (newStatus) => {
        this.setState((prevState) => {
          if (newStatus?.severity !== prevState.status?.severity) {
            return { status: newStatus ?? undefined };
          }
          return null;
        });
      });
    }
  }

  componentWillUnmount() {
    statusChecker.stop();
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("CopilotKit Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.state.error instanceof CopilotKitError) {
        return (
          <>
            {this.props.children}
            {this.props.showUsageBanner && (
              <UsageBanner
                severity={this.state.status?.severity ?? this.state.error.severity}
                message={this.state.status?.message ?? this.state.error.message}
                actions={getErrorActions(this.state.error)}
              />
            )}
          </>
        );
      }
      throw this.state.error;
    }

    return this.props.children;
  }
}

/**
 * Pushes a provided error into the global error toast system and renders the component's children.
 *
 * When `error` is present, it is forwarded to the toast system via `useErrorToast` and the component renders `children`.
 *
 * @param error - The Error to display in the global toast; if falsy, the function throws to surface the error to an enclosing error boundary.
 * @param children - The React node(s) to render when `error` is provided.
 * @returns The `children` React node(s).
 * @throws The provided `error` (or `undefined`) when `error` is falsy to trigger error handling by an error boundary.
 */
export function ErrorToast({ error, children }: { error?: Error; children: React.ReactNode }) {
  const addErrorToast = useErrorToast();

  useEffect(() => {
    if (error) {
      addErrorToast([error]);
    }
  }, [error, addErrorToast]);

  if (!error) throw error;
  return children;
}