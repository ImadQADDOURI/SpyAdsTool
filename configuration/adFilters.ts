// @/configuration/adFilters.ts
import {
  CalendarDays,
  FileText,
  Globe,
  Hash,
  LayoutTemplate,
  LucideIcon,
  MapPin,
  MonitorSmartphone,
  MousePointerClick,
  Search,
  Tags,
} from "lucide-react";

export type FilterType = "text" | "checkbox" | "number-range" | "date-range";

export interface FilterOption {
  label: string;
  value: string;
  icon?: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  icon?: LucideIcon;
  placeholder?: string;
  options?: FilterOption[];
  searchable?: boolean;
}

export const AD_ARCHIVE_FILTERS: FilterConfig[] = [
  {
    id: "search",
    label: "Global Search",
    type: "text",
    icon: Search,
    placeholder: "Search keywords or phrases...",
  },
  {
    id: "pageName",
    label: "Page Name",
    type: "text",
    icon: FileText,
    placeholder: "e.g., Dine New Zealand",
  },
  {
    id: "domain",
    label: "Domain",
    type: "text",
    icon: Globe,
    placeholder: "e.g., myshop",
  },
  {
    id: "pageCategory",
    label: "Page Category",
    type: "text",
    icon: Tags,
    placeholder: "e.g., Pet Supplies",
  },
  {
    id: "countries",
    label: "Countries",
    type: "checkbox",
    icon: MapPin,
    searchable: true,
    options: [
      { value: "US", label: "United States", icon: "/flags/us.svg" },
      { value: "CA", label: "Canada", icon: "/flags/ca.svg" },
      { value: "GB", label: "United Kingdom", icon: "/flags/gb.svg" },
      { value: "BR", label: "Brazil", icon: "/flags/br.svg" },
      // ... your other countries
    ],
  },
  {
    id: "startDate",
    label: "Date Started",
    type: "date-range",
    icon: CalendarDays,
  },
  {
    id: "collationCount",
    label: "Collation Count",
    type: "number-range",
    icon: Hash,
  },
  {
    id: "platforms",
    label: "Platforms",
    type: "checkbox",
    icon: MonitorSmartphone,
    options: [
      { label: "Facebook", value: "FACEBOOK" },
      { label: "Instagram", value: "INSTAGRAM" },
      { label: "Audience Network", value: "AUDIENCE_NETWORK" },
      { label: "Messenger", value: "MESSENGER" },
    ],
  },
  {
    id: "displayFormats",
    label: "Format",
    type: "checkbox",
    icon: LayoutTemplate,
    options: [
      { label: "Image", value: "IMAGE" },
      { label: "Video", value: "VIDEO" },
      { label: "DCO (Dynamic)", value: "DCO" },
      { label: "Carousel", value: "CAROUSEL" },
    ],
  },
  {
    id: "ctaTypes",
    label: "CTA Button",
    type: "checkbox",
    icon: MousePointerClick,
    options: [
      { label: "Shop Now", value: "SHOP_NOW" },
      { label: "Learn More", value: "LEARN_MORE" },
      { label: "Sign Up", value: "SIGN_UP" },
      { label: "Download", value: "DOWNLOAD" },
    ],
  },
];
