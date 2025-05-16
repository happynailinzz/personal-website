import os
import json

ARTICLES_DIR = 'articles'
INDEX_JSON = os.path.join(ARTICLES_DIR, 'index.json')

def get_md_files():
    """获取 articles 文件夹下所有 .md 文件的相对路径，按文件名倒序排列（新文件在前）"""
    files = [f for f in os.listdir(ARTICLES_DIR) if f.endswith('.md')]
    files.sort(reverse=True)
    return [os.path.join(ARTICLES_DIR, f) for f in files]

def load_index_json():
    if not os.path.exists(INDEX_JSON):
        return []
    try:
        with open(INDEX_JSON, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_index_json(md_files):
    with open(INDEX_JSON, 'w', encoding='utf-8') as f:
        json.dump(md_files, f, ensure_ascii=False, indent=2)

def sync_index():
    md_files = get_md_files()
    index_files = load_index_json()
    if md_files != index_files:
        print('index.json 与实际 .md 文件不同步，正在更新...')
        save_index_json(md_files)
        print('index.json 已更新！')
    else:
        print('index.json 已与 .md 文件同步，无需更改。')

if __name__ == '__main__':
    sync_index() 