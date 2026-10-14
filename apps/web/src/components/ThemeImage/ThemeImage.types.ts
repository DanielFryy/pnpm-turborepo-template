// ThemeImage types and interfaces
import type { ImageProps } from "next/image";

export type ThemeImageProps = Readonly<Omit<ImageProps, "src"> & { srcLight: string; srcDark: string }>;
