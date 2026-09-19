"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Avatar as AvatarComponent } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import { redirect, useRouter } from "next/navigation";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Fullscreen, Search } from "lucide-react";
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
import { Bell, BellIcon, Menu, X, ChevronUp } from "lucide-react";
import Newsletter from "@/components/NewsFooter/Newsletter";
import Footer from "@/components/NewsFooter/Footer";
import RippleButton from "@/components/ui/ripple-button";
import SearchBox from "@/components/SeachBox";
import SubscribeButton from "@/components/SubscribeButton";

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

const getValidImageUrl = (url: string | undefined): string => {
  if (!url) return DEFAULT_FALLBACK_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url === "self" || url === "default") return DEFAULT_FALLBACK_IMAGE;
  if (url.startsWith("/")) return url;
  return DEFAULT_FALLBACK_IMAGE;
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

const categories = ["All", "Crypto", "Finance", "Markets", "NFTs", "Web3"];

// Add function to filter news based on category
const getFilteredNews = (news: any[], category: string) => {
  if (category === "All") return news;

  return news.filter((item) => {
    const searchableText = `${item.title} ${item.description || ""} ${
      item.source.name
    }`.toLowerCase();
    return searchableText.includes(category.toLowerCase());
  });
};

export default function DiscoverView() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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

  const next = () => {
    if (currentIndex + itemsPerPage < news.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

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
      console.error("Reddit fetch error:", err);
      setRedditNews([]);
    }
  };

  const fetchNews = async (query: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?query=${encodeURIComponent(query)}`);

      if (!response.ok) {
        setNews([]);
        return;
      }

      const data = await response.json();
      setNews(data.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
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
  const MobileMenu = ({
    isOpen,
    setIsOpen,
    handleNavbarSearch,
    
    handleSignup,
  }: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    handleNavbarSearch: (query: string) => void;
   
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
                handleLogin()
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

  // Combine all news sources
  const allNews = [
    ...rssNews.map((item) => ({
      ...item,
      type: "rss",
      urlToImage: getValidImageUrl(item.urlToImage),
    })),
    ...redditNews.map((item) => ({
      ...item,
      type: "reddit",
      urlToImage: getValidImageUrl(item.urlToImage),
    })),
    ...gNews.map((item) => ({
      ...item,
      type: "gnews",
      urlToImage: getValidImageUrl(item.urlToImage),
    })),
    ...youtubeVideos.map((video) => ({
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      urlToImage: getValidImageUrl(video.snippet.thumbnails.medium.url),
      source: {
        name: video.snippet.channelTitle,
        icon: DEFAULT_FALLBACK_IMAGE,
      },
      type: "youtube",
      publishedAt: new Date().toISOString(),
    })),
  ];
  const redirectHomePage = () => {
    router.push("/");
  };
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
    fetchYouTubeVideos(query);
    fetchRedditNews(null, query);
    fetchRSSFeeds(); // Keep RSS feeds as they are crypto-specific already
    fetchNews(query); // Fetch news based on the selected category
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

  useEffect(() => {
    const defaultQuery = "cryptocurrency news";
    setSearchTerm(defaultQuery);
    fetchGNews(defaultQuery);
    // fetchNews(defaultQuery);
    fetchYouTubeVideos(defaultQuery);
    fetchRedditNews(null, defaultQuery);
    fetchRSSFeeds();
  }, []);

  function getImageSrc(url: string | undefined) {
    if (!url || url === "self" || url === "default") {
      return DEFAULT_FALLBACK_IMAGE;
    }
    return url;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0B12] to-[#1A1625] text-gray-100">
      {/* Header */}
      <div className="fixed p-4  inset-0 z-0 select-none pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full">
          {/* Purple gradient lines */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(45deg,transparent_45%,rgba(123,97,255,0.1)_45%,rgba(123,97,255,0.1)_55%,transparent_55%)]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(45deg,transparent_35%,rgba(123,97,255,0.1)_35%,rgba(123,97,255,0.1)_45%,transparent_45%)]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[linear-gradient(45deg,transparent_25%,rgba(123,97,255,0.1)_25%,rgba(123,97,255,0.1)_35%,transparent_35%)]" />
        </div>
      </div>
      <nav className="sticky  top-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/ic_m.png"
                alt="Logo"
                width={300}
                height={40}
                className="h-8 w-auto"
                onClick={redirectHomePage}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden absolute  md:flex items-center space-x-6">
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

              {/* Auth buttons */}
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
                      variant="ghost"
                      className="text-gray-300 hover:text-purple-500"
                    >
                      Sign In
                    </Button>
                    <InteractiveHoverButton />
                  </div>
                )}
              </div>

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

        {/* Mobile menu */}
        {/* {mobileMenuOpen && (
          <div className="fixed bg-black inset-0 z-50  backdrop-blur-xl md:hidden">
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-gray-900 shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold text-gray-100">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="px-4 py-6 space-y-6">
                {["Crypto News", "NFTs", "Market Updates", "Web3", "DeFi"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => {
                        handleNavbarSearch(item);
                        setMobileMenuOpen(false);
                      }}
                      className="block  w-full text-left px-4 py-2 text-gray-300 hover:text-purple-500 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {item}
                    </button>
                  )
                )}
                {!isLoggedIn && (
                  <div className="pt-6 border-t border-gray-800">
                    <Button
                      onClick={handleLogin}
                      className="w-full mb-3"
                      variant="outline"
                    >
                      Sign In
                    </Button>
                    <Button onClick={handleSignup} className="w-full">
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )} */}
      </nav>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Discover</h1>
          {/* <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button> */}
        </div>

        <p className="text-gray-400">Crypto news from all around the world</p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search news..."
            className="pl-10 h-10 w-full rounded-full bg-gray-800 border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              className="flex-shrink-0 rounded-full"
              onClick={() => {
                setActiveCategory(category);
                if (category !== "All") {
                  fetchGNews(category);
                  fetchYouTubeVideos(category);
                  fetchRedditNews(null, category);
                  fetchRSSFeeds();
                } else {
                  const defaultQuery = "cryptocurrency news";
                  fetchGNews(defaultQuery);
                  fetchYouTubeVideos(defaultQuery);
                  fetchRedditNews(null, defaultQuery);
                  fetchRSSFeeds();
                }
              }}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Combined News Feed */}
      <div className="px-4 space-y-4 pb-8">
        {getFilteredNews(allNews, activeCategory).map((item, index) => (
          <Link
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="flex gap-4 rounded-xl  bg-[#1A1625] border-none overflow-hidden hover:bg-[#231d30] transition-colors">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={getImageSrc(item.urlToImage)}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={`
                    ${
                      item.type === "youtube"
                        ? "text-red-500 border-red-500/30 bg-red-500/5"
                        : ""
                    }
                    ${
                      item.type === "reddit"
                        ? "text-orange-500 border-orange-500/30 bg-orange-500/5"
                        : ""
                    }
                    ${
                      item.type === "rss"
                        ? "text-blue-500 border-blue-500/30 bg-blue-500/5"
                        : ""
                    }
                    ${
                      item.type === "gnews"
                        ? "text-purple-500 border-purple-500/30 bg-purple-500/5"
                        : ""
                    }
                  `}
                  >
                    {item.source.name}
                  </Badge>
                </div>
                <h3 className="text-sm font-medium line-clamp-2 mb-2 text-gray-100">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Avatar className="w-4 h-4">
                    <AvatarImage
                      src={item.source.icon || DEFAULT_FALLBACK_IMAGE}
                    />
                    <AvatarFallback>{item.source.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{item.source.name}</span>
                  <span>•</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <MobileMenu
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        handleNavbarSearch={handleNavbarSearch} 
         handleSignup={handleSignup}     />

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
