
import { Container } from "@/components/ui/container";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">活動</h1>
          <p className="text-xl text-gray-600 mb-8">
            隨時掌握宿舍的各項活動與事件。
          </p>
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-gray-500">活動頁面即將推出…</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
