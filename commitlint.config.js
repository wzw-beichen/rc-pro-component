// commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"], // 检测规则
  rules: {
    "type-enum": [
      2,
      "always",
      [
        // 特性: 🚀 新增功能
        "feat",
        //修复: 🧩 修复缺陷
        "fix",
        // 文档: 📚 文档变更
        "docs",
        // 格式: 🎨 代码格式（不影响功能，例如空格、分号等格式修正）
        "style",
        // 重构: ♻️  代码重构（不包括 bug 修复、功能新增）
        "refactor",
        // 性能: ⚡️ 性能优化
        "pref",
        // 测试: ✅ 添加疏漏测试或已有测试改动
        "test",
        // 构建: 📦️ 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）
        "chore",
        // 集成: 🎡 修改 CI 配置、脚本
        "ci",
        // 回退: ⏪️ 回滚 commit
        "revert",
        // 打包: 🔨 项目打包发布
        "build",
      ],
    ],
    "type-empty": [2, "never"],
    "type-case": [2, "always", "lower-case"],
    "type-min-length": [2, "always", 2],
    "type-max-length": [2, "always", 10],
    "subject-empty": [2, "never"],
    "header-min-length": [2, "always", 5],
    "header-full-stop": [2, "never", "."],
    "header-max-length": () => {
      return [2, "always", 80];
    },
    "subject-exclamation-mark": [2, "never"],
    // "references-empty": [2, "never"],
    // "signed-off-by": [2, "always", "user-email:"],
    // "trailer-exists": [2, "always", "user-email:"],
    // 自定义rule
    "custom-rule": [1, "always"],
  },
  prompt: {
    messages: {
      type: "选择你要提交的类型 :",
      scope: "选择一个提交范围（可选）:",
      customScope: "请输入自定义的提交范围 :",
      subject: "填写简短精炼的变更描述 :\n",
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixsSelect: "选择关联issue前缀（可选）:",
      customFooterPrefixs: "输入自定义issue前缀 :",
      footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      confirmCommit: "是否提交或修改commit ?",
    },
    types: [
      { value: "feat: 特性", name: "特性: 🚀 新增功能", emoji: "🚀" },
      { value: "fix: 修复", name: "修复: 🧩 修复缺陷", emoji: "🧩" },
      { value: "docs: 文档", name: "文档: 📚 文档变更", emoji: "📚" },
      {
        value: "style: 格式",
        name: "格式: 🎨 代码格式（不影响功能，例如空格、分号等格式修正）",
        emoji: "🎨",
      },
      {
        value: "refactor: 重构",
        name: "重构: ♻️  代码重构（不包括 bug 修复、功能新增）",
        emoji: "♻️",
      },
      { value: "perf: 性能", name: "性能: ⚡️ 性能优化", emoji: "⚡️" },
      {
        value: "test: 测试",
        name: "测试: ✅ 添加疏漏测试或已有测试改动",
        emoji: "✅",
      },
      {
        value: "chore: 构建",
        name: "构建: 📦️ 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）",
        emoji: "📦️",
      },
      {
        value: "ci: 集成",
        name: "集成: 🎡 修改 CI 配置、脚本",
        emoji: "🎡",
      },
      { value: "revert: 回退", name: "回退: ⏪️ 回滚 commit", emoji: "⏪️" },
      { value: "build: 打包", name: "打包: 🔨 项目打包发布", emoji: "🔨" },
    ],
    useEmoji: true,
  },
  plugins: [
    {
      rules: {
        // 定义自定义rule校验方法
        "custom-rule": (commit) => {
          console.log("commit", commit);
          const { subject } = commit;
          const HELLO_WORLD = "Hello World";
          return [
            subject?.includes(HELLO_WORLD),
            `Your subject should contain ${HELLO_WORLD} message`,
          ];
        },
      },
    },
  ],
};
