  
#### Install
```
npm i -D @commitlint/cli @commitlint/config-conventional
```
#### Configure
```
echo "module.exports = { extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```
#### commitlint.config.js
`commitlint.config.js` 是一个配置文件，用于设置代码提交规范。它通常用于在团队协作开发时，规范化代码提交的格式和内容，提高代码可读性和可维护性。在使用该配置文件时，我们需要定义提交信息的格式、校验规则和错误提示等内容，以保证代码提交的质量符合团队和开发项目的要求。  
`commitlint.config.js` 是一个用于配置 `commitlint` 工具的文件，它可以定义 `commit message` 的格式和规范，以便团队成员编写一致的 `commit message`。
##### Commit Message格式
```
Header：<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```
### rules
`rule` 由 `name` 和 `配置数组` 组成，如：`name: [0, 'always', 72]`，数组中 `第一位` 为 `level`  ，`第二位`为`应用`与`否`，可选`always | never`，`第三位`为`rule的值`。
`level值和描述`
| value | 描述  | rule |
|:--------:|:---------:|:---------:|
|   0   |  `disable` | 禁用 
|   1   |  `warning` | x警告  
|   2   |  `error`   | <font color="red">✖</font>错误  
##### Plain array
```
  "rules": {
    "header-max-length": [0, "always", 72],
  }
```
##### Function returning array
```
  "rules": {
    "header-max-length": () => [0, "always", 72],
  }
```
##### Async function returning array
```
  "rules": {
    "header-max-length": async () => [0, "always", 72],
  }
```
##### Function returning a promise resolving to array
```
 "rules": {
    "header-max-length": () => Promise.resolve([0, "always", 72]),
  }
```

##### [type-enum](https://commitlint.js.org/#/reference-rules?id=type-enum)
```
// commitlint.config.js
{
    rules: {
        "type-enum": [2, "always", ["feat", "fix"]],
    }
}
```
```
git commit -m "style: 测试"
✖   type must be one of [feat, fix] [type-enum]
```
```
常用type-enum 注释说明
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
    ]
]
```

##### [type-case](https://commitlint.js.org/#/reference-rules?id=type-case)
```
// commitlint.config.js
{
    rules: {
       "type-case": [2, "never", "lower-case"],
    }
}
```
```
git commit -m "style: 测试"
✖   type must not be lower-case [type-case]
```

##### [type-empty](https://commitlint.js.org/#/reference-rules?id=type-empty)
```
// commitlint.config.js
{
    rules: {
        "type-empty": [2, "never"],
    }
}
```
```
git commit -m "style测试" 
✖   type may not be empty [type-empty]
```


##### [header-min-length](https://commitlint.js.org/#/reference-rules?id=header-min-length)
```
// commitlint.config.js
{
    rules: {
        "header-min-length": [2, "always", 10],
    }
}
```
```
git commit -m "feat: 1-"
✖   header must not be shorter than 10 characters, current length is 8 [header-min-length]
```

##### [header-max-length](https://commitlint.js.org/#/reference-rules?id=header-max-length)
```
// commitlint.config.js
{
    rules: {
        "header-max-length": [2, "always", 20],
    }
}
```
```
git commit -m "feat: 测试最大长度测试最大长度长changdu"
✖  header must not be longer than 20 characters, current length is 26 [header-max-length]
```

##### [header-full-stop](https://commitlint.js.org/#/reference-rules?id=header-full-stop)
```
// commitlint.config.js
{
    rules: {
        "header-full-stop": [2, "never", "-"],
    }
}
```
```
git commit -m "feat: 1-"
✖  header may not end with full stop [header-full-stop]
```
##### [signed-off-by](https://commitlint.js.org/#/reference-rules?id=signed-off-by)
```
// commitlint.config.js
{
    rules: {
        "signed-off-by": [2, "always", "user-email:"],
    }
}
```
```
git commit -m "feat: 测试

user: zwei<277319623@qq.com>"
✖   message must be signed off [signed-off-by]
```
```
git commit -m "feat: 测试

user-email: zwei<277319623@qq.com>"
```

##### [trailer-exists](https://commitlint.js.org/#/reference-rules?id=trailer-exists)
```
// commitlint.config.js
{
    rules: {
        "trailer-exists": [2, "always", "user-email:"],
    }
}
```
```
git commit -m "feat: 测试

user: zwei<277319623@qq.com>"
✖   message must be signed off [signed-off-by]
```
```
git commit -m "feat: 测试

user-email: zwei<277319623@qq.com>"
```

##### 自定义rule
```
{
    rules: {
       "custom-rule": [1, "always"],
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
}
```

##### [subject-exclamation-mark](https://commitlint.js.org/#/reference-rules?id=subject-exclamation-mark)
```
 rules: {
    "type-enum": [
      2,
      "always",
      ["feat!"]
     ],
    "subject-exclamation-mark": [2, "never"],
 }
```
```
git commit -m "feat\!: 测试"
✖   subject must not have an exclamation mark in the subject to identify a breaking change [subject-exclamation-mark]
```
```
"subject-exclamation-mark": [2, "always"],
git commit -m "feat\!: 测试"
pass 通过校验
```

##### [eferences-empty](https://commitlint.js.org/#/reference-rules?id=references-empty)
**待理解**