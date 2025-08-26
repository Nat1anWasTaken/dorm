import { Header } from "@/components/header";

export default function CommitteePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Committee</h1>
          <p className="text-xl text-gray-600 mb-8">
            Meet your dormitory committee members and representatives.
          </p>
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-gray-500">Committee page coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}