import { Header } from "@/components/header";

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
          <p className="text-xl text-gray-600 mb-8">
            Stay updated with all dormitory events and activities.
          </p>
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-gray-500">Events page coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}