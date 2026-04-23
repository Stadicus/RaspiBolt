type Props = {
  src: string;
  title: string;
  caption?: string;
};

export function VideoEmbed({ src, title, caption }: Props) {
  return (
    <figure className="relative my-8">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-3xl bg-amber-500/20 blur-3xl dark:bg-amber-500/15"
      />
      <div className="relative overflow-hidden rounded-xl border border-purple-900/60 shadow-2xl shadow-amber-900/10 dark:border-purple-800/70 dark:shadow-amber-900/30">
        <div className="aspect-video">
          <iframe
            src={src}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="text-fd-muted-foreground mt-3 text-center text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
