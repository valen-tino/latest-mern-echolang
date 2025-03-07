import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Globe, Languages, Video } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Transform Your Videos with AI-Powered{" "}
            <span className="text-primary">Translation</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Break language barriers with our advanced AI translation technology. 
            Translate and dub your videos into multiple languages while preserving 
            natural voice quality and emotions.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24 max-w-7xl mx-auto px-4">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Our AI-powered platform offers everything you need to create professional translations
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Video className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Video Translation</h3>
                <p className="text-sm text-muted-foreground">
                  Translate your videos into multiple languages with AI
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Languages className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Natural Voice</h3>
                <p className="text-sm text-muted-foreground">
                  Preserve voice quality and emotions in translations
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Globe className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Reach audiences worldwide with localized content
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}