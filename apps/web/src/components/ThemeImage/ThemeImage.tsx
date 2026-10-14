import Image from "next/image";
import { twMerge } from "tailwind-merge";

import type { ThemeImageProps as Props } from "./ThemeImage.types";

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, className, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className={twMerge("imgLight", className)} />
      <Image {...rest} src={srcDark} className={twMerge("imgDark", className)} />
    </>
  );
};

export default ThemeImage;
