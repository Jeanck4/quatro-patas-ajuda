
import { ReactNode } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import SkipToContent from '@/components/SkipToContent';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SkipToContent />
      <NavBar />
      <main className="flex-grow" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <AccessibilityToolbar />
    </div>
  );
};

export default MainLayout;
