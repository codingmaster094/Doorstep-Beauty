import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const dirnamePath = dirname(fileURLToPath(import.meta.url))

const compat = new FlatCompat({
  baseDirectory: dirnamePath,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]

export default eslintConfig
