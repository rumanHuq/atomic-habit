import { Layout } from "@ui-kitten/components";
import type { ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
	return <Layout style={{ flex: 1, padding: 8 }}>{children}</Layout>;
}
