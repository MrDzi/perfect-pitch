import React from "react";

const renderInlineElements = (text: string): (string | JSX.Element)[] => {
  // First handle links [text](url)
  const linkParts = text.split(/(\[.*?\]\(.*?\))/);

  return linkParts
    .map((linkPart, linkIndex) => {
      // Check if this part is a link
      const linkMatch = linkPart.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [, linkText, linkUrl] = linkMatch;
        return (
          <a key={`link-${linkIndex}`} href={linkUrl} target="_blank" rel="noopener noreferrer">
            {renderBoldInText(linkText)}
          </a>
        );
      }

      // If not a link, process for bold text
      return renderBoldInText(linkPart, `text-${linkIndex}`);
    })
    .flat();
};

const renderBoldInText = (text: string, keyPrefix = ""): (string | JSX.Element)[] => {
  const parts = text.split(/(\*\*.*?\*\*)/);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-bold-${index}`}>{part.substring(2, part.length - 2)}</strong>;
    }
    return part;
  });
};

export const renderMarkdown = (content: string): (JSX.Element | null)[] => {
  return content.split("\n").map((line, index) => {
    if (line.startsWith("# ")) {
      return <h1 key={index}>{renderInlineElements(line.substring(2))}</h1>;
    }
    if (line.startsWith("## ")) {
      return <h2 key={index}>{renderInlineElements(line.substring(3))}</h2>;
    }
    if (line.startsWith("### ")) {
      return <h3 key={index}>{renderInlineElements(line.substring(4))}</h3>;
    }
    if (line.startsWith("- ")) {
      return <li key={index}>{renderInlineElements(line.substring(2))}</li>;
    }
    return <p key={index}>{renderInlineElements(line)}</p>;
  });
};
