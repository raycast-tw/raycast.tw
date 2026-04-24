import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { MotionConfig } from "framer-motion";
import { CommunityPage } from "./pages/CommunityPage";
import { NewsletterDetailPage } from "./pages/NewsletterDetailPage";
import { EventGalleryPage } from "./pages/EventGalleryPage";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ScrollManager } from "./components/layout/ScrollManager";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center text-white/60">
          頁面發生錯誤，請重新整理。
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  return (
    <>
      <a
        href="#main-content"
        className="bg-foreground text-background absolute top-[-100%] left-4 z-[9999] rounded-b-lg px-4 py-2 text-[14px] font-semibold no-underline transition-[top] duration-150 ease-out focus:top-0"
      >
        跳至主要內容
      </a>
      <ScrollManager />
      <Header />
      <div id="main-content">
        <Routes>
          <Route path="/" element={<CommunityPage />} />
          <Route path="/newsletter/:id" element={<NewsletterDetailPage />} />
          <Route path="/events/:id" element={<EventGalleryPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <AppContent />
        </MotionConfig>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
