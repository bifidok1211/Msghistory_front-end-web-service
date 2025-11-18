const target_tauri = typeof window !== 'undefined' && (window as any).__TAURI__;

export const api_proxy_addr = "http://10.128.146.23:8090";
export const img_proxy_addr = "http://10.128.146.23:9000";

export const dest_api = target_tauri ? api_proxy_addr : "/api";
export const dest_img = target_tauri ? img_proxy_addr : "/img";
export const dest_root = target_tauri ? "" : import.meta.env.BASE_URL;