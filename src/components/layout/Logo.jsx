import Image from "next/image";

export default function Logo({ size = 34, mostrarTexto = true }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/logo.svg" alt="" width={size} height={size} priority />
      {mostrarTexto ? (
        <span className="text-xl font-extrabold leading-none tracking-tight text-ink">
          L<span className="lia-text-gradient">+</span>IA
        </span>
      ) : (
        <span className="sr-only">L+IA</span>
      )}
    </span>
  );
}
