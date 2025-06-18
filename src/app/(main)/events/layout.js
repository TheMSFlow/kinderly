import MainLayout from "@/components/common/MainLayout";

export default function MainParallelLayout({ children, main, sidebar }) {
  return (
    <MainLayout main={main} sidebar={sidebar}>
      {children}
    </MainLayout>
  );
}