import json
import os

def verify():
    report_file = "check_report.txt"
    json_file = "tools.json"
    
    if not os.path.exists(json_file):
        with open(report_file, "w", encoding="utf-8") as f:
            f.write("错误：未找到 tools.json 文件")
        return

    with open(json_file, "r", encoding="utf-8") as f:
        try:
            tools = json.load(f)
        except Exception as e:
            with open(report_file, "w", encoding="utf-8") as f:
                f.write(f"JSON 格式错误: {str(e)}")
            return

    errors = []
    for tool in tools:
        path = tool.get("path", "")
        if not os.path.exists(path):
            errors.append(f"文件不存在: {path} (工具名: {tool.get('name')})")

    if errors:
        with open(report_file, "w", encoding="utf-8") as f:
            f.write("检测到以下路径异常：\n" + "\n".join(errors))
        print("发现错误，报告已生成。")
    else:
        if os.path.exists(report_file):
            os.remove(report_file) # 如果没有错误，删除旧报告
        print("所有路径检查通过。")

if __name__ == "__main__":
    verify()