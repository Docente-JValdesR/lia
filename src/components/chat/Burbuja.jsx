"use client";

import Image from "next/image";
import BotonEscuchar from "@/components/voz/BotonEscuchar";

export function BurbujaLIA({ id, texto, children, escribiendo = false }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full">
        <Image src="/logo.svg" alt="L+IA" width={36} height={36} />
      </span>
      <div className="max-w-[85%]">
        <div className="rounded-2xl rounded-tl-sm border border-line bg-surface px-4 py-3">
          {escribiendo ? (
            <span className="flex items-center gap-1 py-1" aria-label="L+IA está escribiendo">
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
            </span>
          ) : (
            <p className="text-sm leading-relaxed text-ink">{texto}</p>
          )}
          {children}
        </div>
        {!escribiendo && texto && (
          <div className="mt-1.5">
            <BotonEscuchar id={id} texto={texto} />
          </div>
        )}
      </div>
    </div>
  );
}

export function BurbujaUsuario({ texto }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-4 py-2.5 text-sm font-medium text-white">
        {texto}
      </p>
    </div>
  );
}
