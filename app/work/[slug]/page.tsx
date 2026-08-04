import { redirect } from "next/navigation";

type LegacyProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyProjectPage({ params }: LegacyProjectPageProps) {
  const { slug } = await params;
  redirect(`/archive#${slug}`);
}
