"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: { capture: (event: string, payload?: Record<string, unknown>) => void };
    Sentry?: {
      init: (options: Record<string, unknown>) => void;
      captureException: (error: unknown) => void;
      setTag: (key: string, value: string) => void;
    };
  }
}

export const Observability = ({
  gaId,
  posthogKey,
  posthogHost,
  sentryDsn,
}: {
  gaId?: string;
  posthogKey?: string;
  posthogHost?: string;
  sentryDsn?: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (gaId && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: url,
        page_location: window.location.href,
      });
    }

    if (window.posthog) {
      window.posthog.capture("page_view", {
        path: pathname,
        url,
      });
    }

    if (searchParams.get("booking") === "success") {
      if (gaId && window.gtag) {
        window.gtag("event", "booking_conversion", {
          package_path: pathname,
          booking_reference: searchParams.get("ref") || undefined,
        });
      }

      if (window.posthog) {
        window.posthog.capture("booking_conversion", {
          package_path: pathname,
          booking_reference: searchParams.get("ref") || undefined,
        });
      }
    }
  }, [gaId, pathname, posthogKey, searchParams]);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (window.Sentry && event.error) {
        window.Sentry.captureException(event.error);
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (window.Sentry) {
        window.Sentry.captureException(event.reason);
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: false });`}
          </Script>
        </>
      )}

      {posthogKey && (
        <Script id="posthog-init" strategy="afterInteractive">
          {`!function(t,e){var o,n,p,r;e.__SV=1.2,window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split('.');2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement('script')).type='text/javascript',p.crossOrigin='anonymous',p.async=!0,p.src=s.api_host+'/static/array.js',(r=t.getElementsByTagName('script')[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a='posthog',u.people=u.people||[],u.toString=function(t){var e='posthog';return'posthog'!==a&&(e+='.'+a),t||(e+=' (stub)'),e},u.people.toString=function(){return u.toString(1)+'.people (stub)'},o='capture identify alias people.set people.set_once reset opt_in_capturing opt_out_capturing'.split(' '),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1.2}(document,window.posthog||[]);
window.posthog.init('${posthogKey}', { api_host: '${posthogHost || "https://app.posthog.com"}' });`}
        </Script>
      )}

      {sentryDsn && (
        <>
          <Script src="https://browser.sentry-cdn.com/8.41.0/bundle.tracing.min.js" strategy="afterInteractive" />
          <Script id="sentry-init" strategy="afterInteractive">
            {`if (window.Sentry) {
  window.Sentry.init({
    dsn: '${sentryDsn}',
    tracesSampleRate: 0.2,
    environment: '${process.env.NODE_ENV || "development"}',
  });
}`}
          </Script>
        </>
      )}
    </>
  );
};