import { TavilySearchAPIRetriever } from '@langchain/community/retrievers/tavily_search_api';
import { ChatOpenAI } from '@langchain/openai';
import { pull } from 'langchain/hub';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export async function webSearch(query: string) {
    console.log('Query within webSearch:', query);
  const retriever = new TavilySearchAPIRetriever({
    apiKey: "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",
    k: 3, 
  });
  const webDocuments = await retriever.invoke(query);
  console.log('webDocuments:', webDocuments);

  const urlsAndContents = webDocuments.map(doc => ({
    url: doc.metadata.source, 
    content: doc.pageContent,
  }));

  return urlsAndContents;
}

export async function generateAnswer(question: string, contents: string[]) {
  const model = new ChatOpenAI({
    apiKey: "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",
    model: 'gpt-4o-mini',
    temperature: 0,
  });

  const prompt = await pull<ChatPromptTemplate>('rlm/rag-prompt');
  const ragChain = prompt.pipe(model).pipe(new StringOutputParser());

  const combinedContent = contents.join('\n\n');

  const generation = await ragChain.invoke({
    context: combinedContent,
    question,
  });

  return generation;
}

export async function main(query: string) {
  const urlsAndContents = await webSearch(query);
  console.log('urlsAndContents:', urlsAndContents);
  console.log('query withing the main', query);

  const contents = urlsAndContents.map(item => item.content);

  const answer = await generateAnswer(query, contents);
  return answer as string;
}

