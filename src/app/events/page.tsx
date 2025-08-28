import { Container } from "@/components/ui/container";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-16">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">活動</h1>
          <p className="mb-8 text-xl text-gray-600">
            隨時掌握宿舍的各項活動與事件。
          </p>
          <div className="rounded-lg bg-white p-8 shadow">
            <p className="text-gray-500">活動頁面即將推出…</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
