import { generateSrcSet } from "@/lib/utils";
import { DBProduct } from "@/types";

interface ProductDataTableCellViewerProps {
  item: DBProduct;
}

export default function ProductDataTableCellViewer({
  item,
}: ProductDataTableCellViewerProps) {
  const image = item.images[0];

  const srcSet = generateSrcSet({
    large: image.urls?.large as string,
    medium: image.urls?.medium as string,
    original: image.urls?.original as string,
    thumbnail: image.urls?.thumbnail as string,
  });

  return (
    <div className="flex items-center gap-x-2">
      <img
        src={image.urls?.medium as string}
        srcSet={srcSet}
        sizes="(max-width: 300px) 300px, (max-width: 600px) 600px,
         (max-width: 1200px) 1200px, 2000px"
        alt={item.name}
        loading="lazy"
        decoding="async"
        className="size-8 rounded-md bg-muted"
      />
      {item.name}
    </div>
  );
}
