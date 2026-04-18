import { useState, useEffect } from "react";
import { Newspaper, ExternalLink, RefreshCw, Loader2, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import WidgetCard from "@/components/WidgetCard";
import { fetchNews } from "@/lib/api";
import { cn } from "@/lib/utils";

interface NewsItem {
  title: string;
  url: string;
  content: string;
}

const fallbackNews: NewsItem[] = [
  { title: "Tata Capital AUM Crosses ₹88,000 Cr — Strong Q1 Growth", url: "#", content: "Tata Capital reports robust AUM growth driven by retail lending and MSME disbursements, with digital lending TAT reduced to 18 hours." },
  { title: "RBI Tightens NBFC Lending Norms — Impact on Co-Lending", url: "#", content: "New guidelines require enhanced risk monitoring, stricter NPA provisioning, and mandatory stress testing for all NBFC co-lending partnerships." },
  { title: "Digital Lending Platforms See 40% Growth in Personal Loans", url: "#", content: "NBFC digital lending platforms report record personal loan disbursements as AI-powered underwriting reduces processing time significantly." },
  { title: "Tata Group Financial Services Consolidation Gains Momentum", url: "#", content: "Tata Capital's diversified portfolio spanning housing finance, wealth management, and MSME lending positions it strongly in the NBFC space." },
];

const NewsWidget = () => {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [loading, setLoading] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await fetchNews();
      if (data && data.length > 0) {
        setNews(data.slice(0, 4));
      }
    } catch {
      // Use fallback news silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <WidgetCard
      title="Market Intelligence"
      icon={<Newspaper className="w-4 h-4" />}
      badge={
        <span className="text-[10px] font-bold bg-info/10 text-info px-1.5 py-0.5 rounded flex items-center gap-1">
          <TrendingUp className="w-2.5 h-2.5" />
          Live
        </span>
      }
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={loadNews}
          disabled={loading}
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
        </Button>
      }
    >
      {loading && news.length === 0 ? (
        <div className="py-4 text-center">
          <Loader2 className="w-5 h-5 text-primary mx-auto animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {news.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative p-4 rounded-lg border border-border transition-all hover:shadow-hover hover:border-primary/30",
                i === 0 ? "bg-gradient-to-br from-primary/5 to-accent" : "bg-secondary"
              )}
            >
              <div className="flex items-center gap-1 mb-2">
                <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">Just now</span>
              </div>
              <h4 className="text-xs font-semibold text-foreground group-hover:text-primary line-clamp-2 leading-relaxed mb-2">{item.title}</h4>
              <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">{item.content}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Read more <ExternalLink className="w-2.5 h-2.5" />
              </div>
            </a>
          ))}
        </div>
      )}
    </WidgetCard>
  );
};

export default NewsWidget;
