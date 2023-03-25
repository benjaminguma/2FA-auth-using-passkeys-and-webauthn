import AuthProvider, { useAuth } from "@/AuthProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppPropsType, NextComponentType } from "next/dist/shared/lib/utils";
import { useRouter } from "next/router";
import { ReactNode } from "react";

type CustomAppProps = AppPropsType & {
	Component: NextComponentType & { protected?: boolean }; // add auth type
};

export default function App({ Component, pageProps }: CustomAppProps) {
	return (
		<AuthProvider>
			{Component.protected ? (
				<AuthManager>
					<Component {...pageProps} />
				</AuthManager>
			) : (
				<Component {...pageProps} />
			)}
		</AuthProvider>
	);
}

function AuthManager({ children }: { children: ReactNode | ReactNode[] }) {
	const { status } = useAuth();
	const router = useRouter();
	if (status === "loading") {
		return <h1>processing...</h1>;
	}
	if (status === "unauthenticated") {
		router.push("/");
		return null;
	}
	return <>{children}</>;
}
