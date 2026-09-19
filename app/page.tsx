"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Avatar as AvatarComponent } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import { useRouter } from "next/navigation";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import {
  CryptoIcon,
  ChevronIcon,
  // ChevronLeftIcon,
  // ChevronRightIcon,
  SearchIcon,
  ArrowRightIcon,
  TimeIcon,
} from "@/components/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useCallback, useState } from "react";
import { Bell, BellIcon, Menu, X, ChevronUp, Search } from "lucide-react";
import Newsletter from "@/components/NewsFooter/Newsletter";
import Footer from "@/components/NewsFooter/Footer";
import RippleButton from "@/components/ui/ripple-button";
import SubscribeButton from "@/components/SubscribeButton";
import SearchBox from "@/components/SeachBox";
import CryptoPrice from "@/components/CryptoTicker";
import CryptoTicker from "@/components/CryptoTicker";

// Inters
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  source: {
    name: string;
    icon?: string;
  };
  publishedAt: string;
}

interface TwitterPost {
  id: string;
  text: string;
  user: {
    name: string;
    screen_name: string;
    profile_image_url: string;
  };
  created_at: string;
}

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
  };
}

// Add the styles to your Tailwind config if not already present
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient 15s ease infinite;
      }
    `;
  document.head.appendChild(style);
}

// Interfaces
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  source: {
    name: string;
    icon?: string;
  };
  publishedAt: string;
}

interface TwitterPost {
  id: string;
  text: string;
  user: {
    name: string;
    screen_name: string;
    profile_image_url: string;
  };
  created_at: string;
}

const DEFAULT_FALLBACK_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/4588/4588164.png";

// Add new animation keyframes
const gradientAnimation = {
  "@keyframes gradient": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  ".animate-gradient-x": {
    backgroundSize: "200% 200%",
    animation: "gradient 15s ease infinite",
  },
};

// Add the styles to your Tailwind config if not already present
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient 15s ease infinite;
      }
    `;
  document.head.appendChild(style);
}

export default function NewsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [youtubeVideos, setYoutubeVideos] = useState<
    {
      id: { videoId: string };
      snippet: {
        thumbnails: { medium: { url: string } };
        title: string;
        channelTitle: string;
      };
    }[]
  >([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);
  const [redditNews, setRedditNews] = useState<NewsArticle[]>([]);
  const [nextRedditPageToken, setNextRedditPageToken] = useState<string | null>(
    null
  );
  const [prevRedditPageToken, setPrevRedditPageToken] = useState<string | null>(
    null
  );
  const [twitterPosts, setTwitterPosts] = useState<TwitterPost[]>([]);
  const [nextTwitterPageToken, setNextTwitterPageToken] = useState<
    string | null
  >(null);
  const [prevTwitterPageToken, setPrevTwitterPageToken] = useState<
    string | null
  >(null);
  const [rssNews, setRssNews] = useState<NewsArticle[]>([]);
  const [rssLoading, setRssLoading] = useState(true);

  const [gNews, setGNews] = useState<NewsArticle[]>([]);
  const [gNewsLoading, setGNewsLoading] = useState(true);
  const [gNewsError, setGNewsError] = useState<string | null>(null);
  const [gNewsCurrentPage, setGNewsCurrentPage] = useState(1);
  const gNewsItemsPerPage = 3;

  // Define the mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define loading and error states for each section
  const [youtubeLoading, setYoutubeLoading] = useState(true);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  const [coinNews, setCoinNews] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const router = useRouter();

  function getImageSrc(url: string | undefined) {
    if (!url || url === "self" || url === "default") {
      return DEFAULT_FALLBACK_IMAGE;
    }
    return url;
  }

  const handleLogin = () => {
    router.push("/login");
    // Implement your login logic here
    setIsLoggedIn(true); // Set to true when user logs in
  };
  const handleSignup = () => {
    router.push("/signup");
  };

  const handleLogout = () => {
    // Implement your logout logic here
    setIsLoggedIn(false); // Set to false when user logs out
  };
  const fetchGNews = async (query: string = "cryptocurrency") => {
    try {
      setGNewsLoading(true);
      const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
      if (!API_KEY) {
        throw new Error("GNews API key is not configured");
      }

      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=en&country=us&max=9&apikey=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `GNews API request failed with status: ${response.status}`
        );
        setGNewsError("Failed to fetch GNews. Please try again.");
        return;
      }

      const data = await response.json();
      const gNewsArticles = data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.image || DEFAULT_FALLBACK_IMAGE,
        source: {
          name: article.source.name || "GNews",
          icon: undefined,
        },
        publishedAt: article.publishedAt || new Date().toISOString(),
      }));

      setGNews(gNewsArticles);
      setGNewsError(null);
    } catch (err) {
      console.error("Detailed GNews Error:", err);
      setGNewsError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setGNews([]);
    } finally {
      setGNewsLoading(false);
    }
  };

  const handleGNewsPageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(gNews.length / gNewsItemsPerPage)) {
      setGNewsCurrentPage(newPage);
    }
  };

  const YOUTUBE_API_KEY =
    process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "YOUR_YOUTUBE_API_KEY";

  const fetchRedditNews = async (
    afterToken: string | null = null,
    query: string = "cryptocurrency"
  ) => {
    try {
      const redditResponse = await fetch(
        `/api/reddit?query=${encodeURIComponent(query)}${
          afterToken ? `&after=${encodeURIComponent(afterToken)}` : ""
        }`
      );
      if (!redditResponse.ok) {
        setRedditNews([]);
        return;
      }
      const redditData = await redditResponse.json();
      if (!redditData?.data?.children || !Array.isArray(redditData.data.children)) {
        setRedditNews([]);
        return;
      }
      const redditArticles = redditData.data.children.map((child: any) => ({
        title: child.data.title,
        url: `https://www.reddit.com${child.data.permalink}`,
        urlToImage:
          child.data.thumbnail && child.data.thumbnail.startsWith("http")
            ? child.data.thumbnail
            : DEFAULT_FALLBACK_IMAGE,
        source: { name: "Reddit" },
        publishedAt: new Date(child.data.created_utc * 1000).toISOString(),
      }));
      setRedditNews(redditArticles);
      setNextRedditPageToken(redditData.data.after || null);
      setPrevRedditPageToken(redditData.data.before || null);
    } catch (err) {
      console.error("Reddit news fetch error:", err);
      setRedditNews([]);
    }
  };

  // Refactor fetchYouTubeVideos with useCallback
  const fetchYouTubeVideos = useCallback(
    async (query: string) => {
      try {
        setYoutubeLoading(true);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=9&q=${encodeURIComponent(
            query
          )}&type=video&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
          console.error(
            `YouTube API request failed with status: ${response.status}`
          );
          setYoutubeError("Failed to fetch YouTube videos. Please try again.");
          return;
        }

        const data = await response.json();
        setYoutubeVideos(data.items);
        setYoutubeError(null);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        setYoutubeError("Failed to fetch YouTube videos. Please try again.");
      } finally {
        setYoutubeLoading(false);
      }
    },
    [YOUTUBE_API_KEY]
  );

  // Example useEffect to fetch videos

  const fetchRSSFeeds = async () => {
    try {
      setRssLoading(true);

      const feeds = [
        "https://www.newsbtc.com/feed/",
        "https://bitcoinmagazine.com/.rss/full/",
        "https://cryptopotato.com/feed/",
      ];

      const responses = await Promise.allSettled(
        feeds.map((feed) =>
          fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
              feed
            )}`
          )
        )
      );

      const data = await Promise.all(
        responses
          .filter((response) => response.status === "fulfilled")
          .map((response: any) => response.value.json())
      );

      const transformedArticles = data.flatMap(
        (feed) =>
          feed.items?.map((item: any) => ({
            title: item.title || "No title available",
            description: item.description || "No description available",
            url: item.link || "#",
            urlToImage: item.thumbnail || item.enclosure?.link || "",
            source: {
              name: feed.feed?.title || "Unknown Source",
              icon: feed.feed?.favicon || "",
            },
            publishedAt: item.pubDate || new Date().toISOString(),
          })) || []
      );

      const sortedArticles = transformedArticles
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        )
        .slice(0, 9);

      setRssNews(sortedArticles);
      setError(null);
    } catch (err) {
      console.error("RSS Feed Error:", err);
      setError("Failed to fetch RSS feeds. Please try again.");
    } finally {
      setRssLoading(false);
    }
  };

  // const fetchTwitterPosts = async (
  //   query: string,
  //   pageToken: string | null = null
  // ) => {
  //   try {
  //     setLoading(true);

  //     const url = `https://twitter-api45.p.rapidapi.com/usermedia.php?screenname=${encodeURIComponent(
  //       query
  //     )}${
  //       pageToken ? `&pagination_token=${encodeURIComponent(pageToken)}` : ""
  //     }`;

  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "X-RapidAPI-Key": "7760b52a34mshe145977f1ea47fep190b18jsn60ad0f119d3",
  //         "X-RapidAPI-Host": "twitter-api45.p.rapidapi.com",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch Twitter posts: ${response.status}`);
  //     }

  //     const data = await response.json();

  //     // Transform the API response to match our TwitterPost interface
  //     const transformedPosts =
  //       data?.map((tweet: any) => ({
  //         id: tweet.id_str || tweet.id,
  //         text: tweet.text || tweet.full_text,
  //         user: {
  //           name: tweet.user.name,
  //           screen_name: tweet.user.screen_name,
  //           profile_image_url:
  //             tweet.user.profile_image_url_https ||
  //             tweet.user.profile_image_url,
  //         },
  //         created_at: tweet.created_at,
  //       })) || [];

  //     setTwitterPosts(transformedPosts);

  //     // Update pagination tokens if available in the response
  //     setNextTwitterPageToken(data.pagination_token || null);
  //     setPrevTwitterPageToken(null); // This endpoint might not support previous page
  //     setError(null);
  //   } catch (err) {
  //     console.error("Twitter API Error:", err);
  //     setError("Failed to fetch Twitter posts. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleNavbarSearch = (query: string) => {
    setSearchTerm(query);
    // fetchCoinNews();
    // fetchNews(query);
    fetchYouTubeVideos(query);
    fetchRedditNews(null, query);
    fetchRSSFeeds(); // Keep RSS feeds as they are crypto-specific already
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // fetchNews(searchTerm.trim());

      fetchYouTubeVideos(searchTerm.trim());
      fetchRedditNews(null, searchTerm.trim());
      // fetchTwitterPosts("elonmusk"); // Keep showing Elon's tweets regardless of search
    }
  };

  const handleNextRedditPage = () => {
    if (nextRedditPageToken) {
      fetchRedditNews(nextRedditPageToken, searchTerm);
    }
  };

  const handlePrevRedditPage = () => {
    if (prevRedditPageToken) {
      fetchRedditNews(prevRedditPageToken, searchTerm);
    }
  };

  // const handleNextTwitterPage = () => {
  //   if (nextTwitterPageToken) {
  //     // fetchTwitterPosts(searchTerm, nextTwitterPageToken);
  //   }
  // };

  // const handlePrevTwitterPage = () => {
  //   if (prevTwitterPageToken) {
  //     fetchTwitterPosts(searchTerm, prevTwitterPageToken);
  //   }
  // };

  // // const fetchCoinNews = async () => {
  // //   setLoading(true);
  // //   const feeds = [
  // //     "https://www.coindesk.com/feed/",
  // //     "https://cointelegraph.com/rss",
  // //   ];

  // //   try {
  // //     const responses = await Promise.all(
  // //       feeds.map((feed) =>
  // //         fetch(
  // //           `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
  // //             feed
  // //           )}`
  // //         )
  // //       )
  // //     );

  // //     const data = await Promise.all(responses.map((res) => res.json()));

  // //     const articles = data.flatMap((feed) =>
  // //       feed.items.map((item) => ({
  // //         title: item.title,
  // //         description: item.description,
  // //         url: item.link,
  // //         publishedAt: item.pubDate,
  // //         imageUrl: item.thumbnail || DEFAULT_FALLBACK_IMAGE,
  // //         source: {
  // //           name: feed.feed.title, // Assuming the feed title is the source name
  // //           icon: DEFAULT_FALLBACK_IMAGE, // You can set a specific icon if available
  // //         },
  // //       }))
  // //     );

  // //     // Filter articles based on the keyword
  // //     const filteredArticles = articles.filter(
  // //       (article) =>
  // //         article.title.toLowerCase().includes(keyword.toLowerCase()) ||
  // //         article.description.toLowerCase().includes(keyword.toLowerCase())
  // //     );

  // //     // Limit to at least 6 articles
  // //     const limitedArticles = filteredArticles.slice(0, 6);
  // //     setCoinNews(limitedArticles);
  // //     setError(null);
  // //   } catch (err) {
  // //     console.error("Coin News Error:", err);
  // //     setError("Failed to fetch coin news. Please try again.");
  // //   } finally {
  // //     setLoading(false);
  // //   }
  // // };

  // useEffect(() => {
  //   // fetchCoinNews(); // Fetch news based on the keyword
  // }, []); // Fetch once on component mount
  const redirectHomePage = () => {
    router.push("/");
  };

  useEffect(() => {
    const defaultQuery = "cryptocurrency news";
    setSearchTerm(defaultQuery);
    fetchGNews(defaultQuery);
    fetchYouTubeVideos(defaultQuery);
    fetchRedditNews(null, defaultQuery);
    fetchRSSFeeds();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      <div className="h-[400px] bg-gray-800 rounded-2xl" />
      <div className="grid md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="h-48 bg-gray-700" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MobileMenu = ({
    isOpen,
    setIsOpen,
    handleNavbarSearch,
    handleLogin,
    handleSignup,
  }: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleNavbarSearch: (query: string) => void;
    handleLogin: () => void;
    handleSignup: () => void;
  }) => (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-gray-800 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-purple-500">
            Welcome to Cryow3times
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="space-y-4">
          {["Crypto News", "NFTs", "Market Updates", "Web3", "DeFi"].map(
            (item) => (
              <button
                key={item}
                onClick={() => {
                  handleNavbarSearch(item);
                  setIsOpen(false);
                }}
                className="block w-full text-left text-gray-300 hover:text-purple-500 font-medium transition-colors py-2"
              >
                {item}
              </button>
            )
          )}
        </div>
        <div className="mt-8 flex items-center gap-2">
          <SearchBox
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="mt-6 space-y-4  flex flex-row gap-4 align-middle items-center">
          <div className="flex flex-row items-center border border-white rounded-xl p-1 gap-0 align-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path>
            </svg>{" "}
            <Button
              onClick={() => {
                handleLogin();
                setIsOpen(false);
              }}
              className="w-auto bg-transparent p-2 rounded-xl font-sans  text-white"
            >
              Sign In
            </Button>
          </div>

          <SubscribeButton />
        </div>
      </div>
    </div>
  );

  const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };

      window.addEventListener("scroll", toggleVisibility);

      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return (
      <Button
        className={`fixed bottom-4 right-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={scrollToTop}
      >
        <ChevronUp className="h-6 w-6" />
      </Button>
    );
  };

  return (
    <div
      style={{
        fontFamily:
          "'Mona Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
      }}
      className="min-h-screen bg-gradient-to-br from-[#0D0B12] text-gray-100 animate-gradient-x"
    >
      <div className="fixed p-4  inset-0 z-0 select-none pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full">
          {/* Purple gradient lines */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(45deg,transparent_45%,rgba(123,97,255,0.1)_45%,rgba(123,97,255,0.1)_55%,transparent_55%)]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(45deg,transparent_35%,rgba(123,97,255,0.1)_35%,rgba(123,97,255,0.1)_45%,transparent_45%)]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(45deg,transparent_25%,rgba(123,97,255,0.1)_25%,rgba(123,97,255,0.1)_35%,transparent_35%)]" />
        </div>
      </div>
      <nav className="sticky top-0  p-1 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800 shadow-lg">
        <div className=" mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 relative w-[11rem] h-auto">
              <Image
                src="/ic_m.png"
                alt="Logo"
                width={120}
                height={40}
                className="object-contain cursor-pointer"
                priority
                onClick={redirectHomePage}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {["Crypto News", "NFTs", "Market Updates", "Web3", "DeFi"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => handleNavbarSearch(item)}
                    className="text-gray-300 hover:text-purple-500 font-medium transition-colors"
                  >
                    {item}
                  </button>
                )
              )}
            </div>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              {/* Search bar - desktop */}

              <div className="hidden md:flex relative">
                <SearchBox
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                {/* <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search..."
                  className="pl-14 h-10 w-64 rounded-full bg-gray-800 border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-400"
                /> */}
                {/* <svg
                  className="absolute cursor-text left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="currentColor"
                >
                  <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                </svg>{" "} */}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-300 hover:text-purple-500"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Auth buttons - desktop */}
              <div className="hidden md:flex items-center space-x-2">
                {isLoggedIn ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="Profile"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleLogin}
                      className="text-white font-[20px] hover:text-purple-400 font-sans !bg-transparent"
                    >
                      Sign In
                    </Button>
                    <InteractiveHoverButton />
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-gray-900/90 backdrop-blur-xl md:hidden">
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-gray-900 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-gray-100">
                  Welcome to Cryow3Times
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="p-4">
                <div className="relative">
                  {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
                  <Input
                    placeholder="Search..."
                    className="pl-10 h-10 w-full rounded-full bg-gray-800 border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                        setMobileMenuOpen(false);
                      }
                    }}
                  />
                  <svg
                    className="absolute cursor-text left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="currentColor"
                  >
                    <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                  </svg>{" "}
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="px-4 py-6 space-y-6">
                {["Crypto News", "NFTs", "Market Updates", "Web3", "DeFi"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => {
                        handleNavbarSearch(item);
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:text-purple-500 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {item}
                    </button>
                  )
                )}
                {!isLoggedIn && (
                  <div className="pt-6 border-gray-800">
                    <Button
                      onClick={handleLogin}
                      className="w-full mb-3"
                      variant="outline"
                    >
                      Sign In
                    </Button>
                    <InteractiveHoverButton />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="mb-0 ">
        <CryptoTicker />
      </div>

      <main className="container mx-auto p-8 px-4 py-4">
      
        {/* Mobile Breaking News Section */}
        <div className="md:hidden mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-['Mona_Sans'] font-semibold">
              Breaking News
            </h2>
            <Link href="/discover" className="text-sm text-purple-500">
              View all
            </Link>
            
          </div>
        

          <div className="relative">
            <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              <div className="flex space-x-4">
                {rssNews.slice(0, 3).map((article, index) => (
                  <div
                    key={index}
                    className="snap-center w-[85vw] flex-shrink-0"
                  >
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <Image
                        src={getImageSrc(article.urlToImage)}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 p-4 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-blue-500">
                            {article.source.name}
                          </Badge>
                          <span className="text-xs text-gray-300">
                            6 hours ago
                          </span>
                        </div>
                        <h3 className="text-white font-medium line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Recommendations Section */}
        <div className="md:hidden mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-['Mona_Sans'] font-semibold">
              Recommendation
            </h2>
            <Link href="/discover" className="text-sm text-purple-500">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[...rssNews, ...redditNews].slice(0, 10).map((article, index) => (
              <Link
                key={index}
                href={article.url}
                className="flex gap-4 items-center p-2 rounded-xl bg-gray-900/50"
              >
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={getImageSrc(article.urlToImage || DEFAULT_FALLBACK_IMAGE)}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Badge
                    variant="outline"
                    className="mb-2 text-purple-500 border-purple-500/30 bg-purple-500/5"
                  >
                    {article.source.name}
                  </Badge>
                  <h3 className="text-sm font-medium line-clamp-2 mb-1">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-400">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:grid p-8 lg:grid-cols-[1fr_400px] gap-12">
          <div>
            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="bg-red-900/20 border border-red-800 p-4 rounded-xl">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            ) : (
              <>
                {redditNews.length === 0 &&
                youtubeVideos.length === 0 &&
                rssNews.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xl text-gray-400">
                      No news available. Please try refreshing the page.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Best of the Week */}
                    <div className="mb-12">
                      <Badge className="bg-[#2c2a3a] text-purple-500 mb-4 uppercase tracking-wider font-medium">
                        BEST OF THE WEEK
                      </Badge>
                      {rssNews[0] && (
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Badge
                                variant="outline"
                                className="border-purple-500/30 bg-purple-500/5 text-purple-500"
                              >
                                Blockchain News
                              </Badge>
                              <span>12 hours ago</span>
                            </div>
                            <h1 className="text-3xl font-bold font-['Mona_Sans'] leading-tight">
                              {rssNews[0].title}
                            </h1>
                            <div className="flex gap-2">
                              <Badge
                                variant="outline"
                                className="border-gray-700 text-gray-400"
                              >
                                #Ethereum
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-gray-700 text-gray-400"
                              >
                                #Analytics
                              </Badge>
                            </div>
                            <div className="flex items-center gap-0 group">
                              <Button
                                variant="outline"
                                className="border-purple-500 bg-black rounded-full text-white hover:bg-purple-500/10"
                              >
                                Read article
                              </Button>
                              <a href="">
                                <ArrowRightIcon className="ml-0 h-10 w-10 text-purple-500 border border-purple-500 rounded-full bg-black hover:bg-purple-500/10" />
                              </a>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/20 rounded-3xl" />
                            <div className="relative w-full h-[300px] rounded-3xl overflow-hidden">
                              <Image
                                src={getImageSrc(rssNews[0].urlToImage || DEFAULT_FALLBACK_IMAGE)}
                                alt={rssNews[0].title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* YouTube Videos */}
                    {youtubeLoading ? (
                      <LoadingSkeleton />
                    ) : youtubeError ? (
                      <div className="text-red-500 text-center">
                        {youtubeError}
                      </div>
                    ) : (
                      <section className="mb-12 flex flex-col">
                        <div className="flex mb-4">
                          <h2 className="text-4xl w-full font-normal font-['Mona_Sans'] flex items-center justify-between">
                            YouTube Videos
                          </h2>
                          <div className="flex gap-2 mb-4 items-end justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={!prevPageToken}
                              onClick={() =>
                                prevPageToken &&
                                fetchYouTubeVideos(
                                  `${
                                    searchTerm || "cryptocurrency"
                                  } ${prevPageToken}`
                                )
                              }
                              className="h-8 w-8 rounded-full border-gray-800"
                            >
                              <ArrowRightIcon className="rotate-180" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={!nextPageToken}
                              onClick={() =>
                                nextPageToken &&
                                fetchYouTubeVideos(
                                  `${
                                    searchTerm || "cryptocurrency"
                                  } ${nextPageToken}`
                                )
                              }
                              className="h-8 w-8 rounded-full border-gray-800"
                            >
                              <ArrowRightIcon />
                            </Button>
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                          {youtubeVideos.slice(0, 9).map((video) => (
                            <div
                              key={video.id.videoId}
                              className="bg-[#0A0B0F]/60 backdrop-blur-xl border-white/10 rounded-xl hover:rounded-2xl hover:border-[#8B5CF6]/50  border hover:rounded-2xl hover:border-blue-500/50 rounded-xl transition-all duration-300"
                            >
                              <div className="relative rounded-2xl hover:rounded-2xl hover:border-purple-500">
                                <img
                                  src={video.snippet.thumbnails.medium.url}
                                  alt={video.snippet.title}
                                  className="w-full h-48 rounded-t-2xl object-cover"
                                />
                                <div className="p-4 space-y-2">
                                  <h3 className="text-md font-medium line-clamp-2">
                                    {video.snippet.title}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    {video.snippet.channelTitle}
                                  </p>
                                  <a
                                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline"
                                  >
                                    Watch on YouTube
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Gnews Section*/}
                    {gNewsLoading ? (
                      <LoadingSkeleton />
                    ) : gNewsError ? (
                      <div className="text-red-500 text-center">
                        {gNewsError}
                      </div>
                    ) : (
                      <section className="mb-12 flex flex-col">
                        <div className="flex mb-4">
                          <h2 className="text-4xl w-full font-normal font-sans flex items-center justify-between">
                            GNews Cryptocurrency
                          </h2>
                          <div className="flex gap-2 mb-4 items-end justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={gNewsCurrentPage === 1}
                              onClick={() =>
                                handleGNewsPageChange(gNewsCurrentPage - 1)
                              }
                              className="h-8 w-8 rounded-full border-gray-800"
                            >
                              <ArrowRightIcon className="rotate-180" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              disabled={
                                gNewsCurrentPage * gNewsItemsPerPage >=
                                gNews.length
                              }
                              onClick={() =>
                                handleGNewsPageChange(gNewsCurrentPage + 1)
                              }
                              className="h-8 w-8 rounded-full border-gray-800"
                            >
                              <ArrowRightIcon />
                            </Button>
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                          {gNews
                            .slice(
                              (gNewsCurrentPage - 1) * gNewsItemsPerPage,
                              gNewsCurrentPage * gNewsItemsPerPage
                            )
                            .map((article, index) => (
                              <Link
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                              >
                                <Card className="bg-[#0A0B0F]/60 backdrop-blur-xl border-white/10 rounded-xl hover:rounded-2xl hover:border-[#8B5CF6]/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1">
                                  <div className="relative h-48 rounded-t-xl overflow-hidden">
                                    <Image
                                      src={
                                        article.urlToImage ||
                                        DEFAULT_FALLBACK_IMAGE
                                      }
                                      alt={article.title}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#231d30] via-transparent opacity-50" />
                                    <Badge className="absolute top-4 left-4 bg-purple-500/90 hover:bg-purple-600">
                                      {article.source.name}
                                    </Badge>
                                  </div>
                                  <div className="p-4">
                                    <h3 className="font-semibold text-md leading-tight group-hover:text-purple-500 transition-colors line-clamp-2 mb-3">
                                      {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                                      {article.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6 border-2 border-purple-500/30">
                                          <Image
                                            src={getImageSrc(article.source.icon || DEFAULT_FALLBACK_IMAGE)}
                                            alt="Source"
                                            width={24}
                                            height={24}
                                          />
                                        </Avatar>
                                        <span className="font-small">
                                          {article.source.name}
                                        </span>
                                      </div>
                                      <span>•</span>
                                      <div className="flex items-center gap-2 opacity-60">
                                        <span>
                                          {new Date(
                                            article.publishedAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </Link>
                            ))}
                        </div>
                      </section>
                    )}

                    {/* Reddit Section */}
                    <section className="mb-12 flex flex-col ">
                      <div className="flex mb-4">
                        <h2 className="text-4xl w-full font-normal font-sans flex items-center justify-between">
                          Reddit Highlights
                        </h2>
                        <div className="flex gap-2 mb-4 items-end justify-end">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={!prevRedditPageToken}
                            onClick={handlePrevRedditPage}
                            className="h-8 w-8 rounded-full border-gray-800"
                          >
                            <ArrowRightIcon className="rotate-180" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={!nextRedditPageToken}
                            onClick={handleNextRedditPage}
                            className="h-8 w-8 rounded-full border-gray-800"
                          >
                            <ArrowRightIcon />
                          </Button>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                        {redditNews.slice(0, 9).map((article, index) => (
                          <div
                            key={index}
                            className="bg-[#0A0B0F]/60 backdrop-blur-xl border-white/10 rounded-xl hover:rounded-2xl hover:border-[#8B5CF6]/50 border hover:rounded-2xl hover:border-purple-500/50 rounded-xl transition-all duration-300"
                          >
                            <div className="relative  rounded-2xl hover:rounded-2xl hover:border-purple-500">
                              <div className="w-full h-48 relative">
                                <Image
                                  src={getImageSrc(article.urlToImage &&
                                    article.urlToImage.startsWith("http")
                                      ? article.urlToImage
                                      : DEFAULT_FALLBACK_IMAGE)}
                                  alt={article.title}
                                  fill
                                  className="rounded-t-2xl object-cover"
                                />
                              </div>
                              <div className="p-4 space-y-2">
                                <h3 className="text-md font-medium line-clamp-2">
                                  {article.title}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  Source: {article.source.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  12 hours ago
                                </p>
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline inline-block mt-2"
                                >
                                  Read on Reddit
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* RSS News Section */}
                    <section className="mb-12 flex flex-col">
                      <div className="flex mb-4">
                        <h2 className="text-4xl w-full font-normal font-sans flex items-center justify-between">
                          Crypto News Feeds
                        </h2>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                        {rssNews.slice(0, 9).map((article, index) => (
                          <Link
                            key={index}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group"
                          >
                            <Card className="bg-[#0A0B0F]/60 backdrop-blur-xl border-white/10 rounded-xl hover:rounded-2xl hover:border-[#8B5CF6]/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1">
                              <div className="relative h-48 rounded-t-xl overflow-hidden">
                                <Image
                                  src={
                                    article.urlToImage || DEFAULT_FALLBACK_IMAGE
                                  }
                                  alt={article.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#231d30] via-transparent opacity-50" />
                                <Badge className="absolute top-4 left-4 bg-purple-500/90 hover:bg-purple-600">
                                  {article.source.name}
                                </Badge>
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold text-md leading-tight group-hover:text-purple-500 transition-colors line-clamp-2 mb-3">
                                  {article.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6 border-2 border-purple-500/30">
                                      <Image
                                        src={
                                          article.source.icon ||
                                          DEFAULT_FALLBACK_IMAGE
                                        }
                                        alt="Source"
                                        width={24}
                                        height={24}
                                      />
                                    </Avatar>
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center gap-2 opacity-60">
                                    <span>12 hours ago</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </section>

                    {/* <section className="mb-12 flex flex-col">
                        <div className="flex mb-4">
                          <h2 className="text-4xl w-full font-normal font-sans flex items-center justify-between">
                            CoinDesk & CoinTelegraph News
                          </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
                          {loading && <p className="text-gray-500">Loading...</p>}
                          {error && <p className="text-red-500">{error}</p>}
                          {coinNews.length > 0 ? (
                            coinNews.map((article, index) => (
                              <Link
                                key={index}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                              >
                                <Card className="bg-[#0A0B0F]/60 backdrop-blur-xl border-white/10 rounded-xl hover:rounded-2xl hover:border-[#8B5CF6]/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-1">
                                  <div className="relative h-48 rounded-t-xl overflow-hidden">
                                    <Image
                                      src={article.imageUrl}
                                      alt={article.title}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#231d30] via-transparent opacity-50" />
                                    <Badge className="absolute top-4 left-4 bg-purple-500/90 hover:bg-purple-600">
                                      {article.source.name}
                                    </Badge>
                                  </div>
                                  <div className="p-4">
                                    <h3 className="font-semibold text-md leading-tight group-hover:text-purple-500 transition-colors line-clamp-2 mb-3">
                                      {article.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6 border-2 border-purple-500/30">
                                          <Image
                                            src={article.source.icon}
                                            alt="Source"
                                            width={24}
                                            height={24}
                                          />
                                        </Avatar>
                                      </div>
                                      <span>•</span>
                                      <div className="flex items-center gap-2 opacity-60">
                                        <span>
                                          {new Date(
                                            article.publishedAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </Link>
                            ))
                          ) : (
                            <p className="text-gray-500">
                              No news articles available.
                            </p>
                          )}
                        </div>
                      </section> */}
                  </>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 bg-[#8B5CF6] rounded-[50px]" />
              <h2 className="text-4xl font-['Mona_Sans'] font-normal">
                Recommended
              </h2>
            </div>
            <div className="space-y-6">
              {rssNews.slice(4, 5).map((article, index) => (
                <Link
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="flex gap-5 flex-col bg-[#0A0B0F]/60 backdrop-blur-xl border-white/10 rounded-xl hover:rounded-[50px] hover:border-[#8B5CF6]/50 rounded-[50px] hover:bg-[#2A2438] transition-all duration-300 hover:shadow-xl hover:shadow-[#8B5CF6]/10 transform hover:-translate-y-1">
                    <div className="relative flex w-full h-[300px]">
                      {/* Image */}
                      <Image
                        src={getImageSrc(article.urlToImage || DEFAULT_FALLBACK_IMAGE)}
                        alt={article.title}
                        fill
                        className="rounded-[50px] object-cover"
                      />

                      {/* Text Overlay */}
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#231d30]/80 via-transparent to-transparent p-4">
                        <Badge className="absolute bottom-64 left-4 bg-purple-500/90 hover:bg-purple-600">
                          {article.source.name}
                        </Badge>
                        <h3 className="font-regular text-white text-sm leading-snug group-hover:text-purple-500 transition-colors line-clamp-2 mb-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 opacity-60 text-grey-400 font-sm">
                          <span className="text-sm">12 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}

              {/* New mixed news section */}
              {/* New mixed news section */}
              {[
                ...rssNews.slice(6, 9),
                ...redditNews.slice(6, 9),

                ...youtubeVideos.slice(6, 9).map((video) => ({
                  ...video,
                  type: "youtube",
                  url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                  urlToImage: video.snippet.thumbnails.medium.url,
                  title: video.snippet.title,
                  source: { name: video.snippet.channelTitle },
                })),
              ].map((article, index) => (
                <Link
                  key={index}
                  href={article.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <Card className="flex gap-5 bg-[#0A0B0F]/60 backdrop-blur-xl border-white/10 rounded-xl hover:rounded-2xl hover:border-[#8B5CF6]/50 transition-all duration-300">
                    <div className="relative w-[100px] h-[100px]">
                      <Image
                        src={getImageSrc(article.urlToImage &&
                          (article.urlToImage.startsWith("http") ||
                            article.urlToImage.startsWith("/") ||
                            article.urlToImage === "self")
                            ? article.urlToImage === "self"
                              ? DEFAULT_FALLBACK_IMAGE
                              : article.urlToImage
                            : DEFAULT_FALLBACK_IMAGE)}
                        alt={article.title || "News Article"}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex-1 py-2 pr-4">
                      <Badge
                        variant="outline"
                        className="text-purple-500 border-purple-500/30 bg-purple-500/5"
                      >
                        {article.source?.name || "Unknown Source"}
                      </Badge>
                      <div className="flex items-center gap-2 opacity-60">
                        <span>12 hours ago</span>
                      </div>
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="">
          <Footer />
        </div>
      </main>
      <MobileMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        handleNavbarSearch={handleNavbarSearch}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
      />
      <ScrollToTopButton />
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
