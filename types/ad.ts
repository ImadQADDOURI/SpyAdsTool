// types/ad.ts

export interface AdData {
  ad_archive_id: string;
  ad_id: string | null;
  archive_types: string[];
  categories: string[];
  collation_count: number | null;
  collation_id: string | null;
  contains_digital_created_media: boolean;
  contains_sensitive_content: boolean;
  currency: string;
  end_date: number;
  entity_type: string;
  fev_info: any | null;
  finserv_ad_data: {
    is_deemed_finserv: boolean;
    is_limited_delivery: boolean;
  };
  gated_type: string;
  has_user_reported: boolean;
  hidden_safety_data: boolean;
  hide_data_status: string;
  impressions_with_index: {
    impressions_text: string | null;
    impressions_index: number;
  };
  is_aaa_eligible: boolean;
  is_active: boolean;
  is_profile_page: boolean;
  menu_items: any[];
  page_id: string;
  page_is_deleted: boolean;
  page_name: string;
  political_countries: string[];
  publisher_platform: string[];
  reach_estimate: any | null;
  report_count: number | null;
  snapshot: {
    body: {
      text: string;
    };
    branded_content: {
      current_page_name: string;
      page_categories: string[];
      page_id: string;
      page_is_deleted: boolean;
      page_name: string;
      page_profile_pic_url: string | null;
      page_profile_uri: string;
    } | null;
    brazil_tax_id: string | null;
    byline: string | null;
    caption: string | null;
    cards: Media[];
    cta_text: string;
    cta_type: string;
    country_iso_code: string | null;
    current_page_name: string;
    disclaimer_label: string | null;
    display_format: string;
    event: any | null;
    images: Media[];
    is_reshared: boolean;
    link_description: string | null;
    link_url: string | null;
    page_categories: string[];
    page_entity_type: string;
    page_id: string;
    page_is_deleted: boolean;
    page_is_profile_page: boolean;
    page_like_count: number;
    page_name: string;
    page_profile_picture_url: string | null;
    page_profile_uri: string;
    root_reshared_post: any | null;
    title: string | null;
    videos: Media[];
    additional_info: any | null;
    ec_certificates: any[];
    extra_images: any[];
    extra_links: any[];
    extra_texts: any[];
    extra_videos: any[];
  };
  spend: any | null;
  start_date: number;
  state_media_run_label: string | null;
}

export interface Media {
  body?: string;
  caption?: string;
  cta_text?: string;
  cta_type?: string;
  image_crops?: any[];
  link_description?: string | null;
  link_url?: string;
  original_image_url?: string | null;
  resized_image_url?: string | null;
  watermarked_resized_image_url?: string | null;
  title?: string;
  video_hd_url?: string | null;
  video_preview_image_url?: string | null;
  video_sd_url?: string | null;
  watermarked_video_hd_url?: string | null;
  watermarked_video_sd_url?: string | null;
}
