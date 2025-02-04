import fs from "fs/promises"
import path from "path"
import ReactMarkdown from "react-markdown"

export default async function TermsOfService() {
    const filePath = path.join(process.cwd(), "./content/terms-of-service.md")
    const content = await fs.readFile(filePath, "utf8")

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-pink-50 rounded-lg shadow-md">
            <div className="max-w-3xl mx-auto pt-20">
                <ReactMarkdown className="prose prose-pink">{content}</ReactMarkdown>
            </div>
        </div>
    )
}

