import Head from "next/head";
import { useRouter } from "next/router";


import {PortableText} from '@portabletext/react'
import {usePreviewSubscription, urlFor} from '@lib/sanity'
import {getClient} from '@lib/sanity.server'
import ProductsPage from "../components/ProductsPage";

import { groq } from "next-sanity";

export default function Index(props) {
  const { postdata, preview } = props;

  const router = useRouter();

  const { data: products } = usePreviewSubscription(query, {
    initialData: postdata,
    enabled: preview || router.query.preview !== undefined,
  });
  return (
    <>
      <div className="my-8">
      <div className="mt-4">
        <ProductsPage products={products} />
      </div>
    </div>
    </>
  );
}

const query = groq`
*[_type == "product"] | order(_createdAt desc) {
  ..., 
  categories[]->,
  conditions[]->
}
`;

export async function getStaticProps({ params, preview = false }) {
  const products = await getClient(preview).fetch(query);

  return {
    props: {
      postdata: products,
      preview,
    },
    revalidate: 10,
  };
}
