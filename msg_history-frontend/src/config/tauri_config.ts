// Проверка на Tauri v2 (использует __TAURI_INTERNALS__) или v1 (__TAURI__)
// Также проверяем import.meta.env.MODE на случай, если window еще не инициализирован
const isTauri = import.meta.env.MODE === 'tauri' || 
                (typeof window !== 'undefined' && (
                    !!(window as any).__TAURI_INTERNALS__ || 
                    !!(window as any).__TAURI__
                ));

export const api_proxy_addr = "http://10.128.146.23:8090";
export const img_proxy_addr = "http://10.128.146.23:9000";

export const dest_api = isTauri ? api_proxy_addr : "/api";
export const dest_img = isTauri ? img_proxy_addr : "/img";

// В Tauri корень — это просто "/", так как нет подпапок GitHub Pages
export const dest_root = isTauri ? "/" : import.meta.env.BASE_URL;