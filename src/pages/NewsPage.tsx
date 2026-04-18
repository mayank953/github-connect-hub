import { useState, useEffect } from "react";
import { Newspaper, ExternalLink, RefreshCw, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { fetchNews } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NewsItem {
  title: string;
  url: string;
  content: string;
  publishedDate?: string;
  score?: number;
}

const fallbackNews: NewsItem[] = [
  { title: "Tata Capital AUM Crosses ₹88,000 Cr with Strong Q1 2026 Growth", url: "#", content: "Tata Capital reports robust AUM growth driven by retail lending and MSME disbursements, with digital lending TAT reduced to 18 hours..." },
  { title: "RBI Tightens NBFC Lending Norms — Impact on Co-Lending Partnerships", url: "#", content: "The Reserve Bank of India has released new guidelines for NBFC co-lending platforms, requiring enhanced risk monitoring and stricter NPA provisioning..." },
  { title: "Digital Lending Platforms See 40% Growth in Personal Loans", url: "#", content: "NBFC digital lending platforms report record personal loan disbursements as AI-powered underwriting reduces processing time significantly..." },
  { title: "AI-Powered Credit Underwriting Reduces Default Rates by 25%", url: "#", content: "Next-gen ML models for MSME and personal loan underwriting show significant improvement in predicting defaults using alternative data..." },
  { title: "Tata Group Financial Services Strategy — Wealth Management Push", url: "#", content: "Tata Capital's diversified portfolio spanning housing finance, wealth management, and MSME lending positions it strongly for the next growth phase..." },
];

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadNews = async (query?: string) => {
    setLoading(true);
    try {
      const data = await fetchNews(query || "Tata Capital NBFC lending financial services India");
      if (data && data.length > 0) setNews(data);
    } catch {
      // use fallback silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) loadNews(searchQuery);
  };

  return (
    <AppLayout>
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Newspaper className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">Market News & Intelligence</h1>
            </div>
            <p className="text-xs text-muted-foreground">Real-time financial news via Tavily AI search</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadNews()} disabled={loading} className="h-8 text-xs gap-1.5">
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full bg-secondary border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Search financial news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" disabled={loading} className="h-9">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {loading && news.length === 0 ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-primary mx-auto mb-2 animate-spin" />
            <p className="text-sm text-muted-foreground">Fetching latest news...</p>
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {news.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{item.content}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default NewsPage;
