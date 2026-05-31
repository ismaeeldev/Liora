"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class MapErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Leaflet Map Error Boundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[350px] bg-slate-50 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-border shadow-inner">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 border border-destructive/25 text-destructive mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Map Rendering Failed
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mb-4 leading-relaxed">
            There was a problem loading the interactive Leaflet map. This may be caused by WebGL limitations or missing WebMap tiles.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={this.handleRetry}
            className="rounded-lg h-9 text-xs border-border"
          >
            Retry Loading Map
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default MapErrorBoundary;
