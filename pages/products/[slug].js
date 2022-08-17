import Error from "next/error";
import { groq } from "next-sanity";
import { useRouter } from "next/router";
import ProductPage from "../../components/ProductPage";
import {  usePreviewSubscription } from "@lib/sanity";
import {getClient} from "@lib/sanity.server"

const query = groq`*[_type == "product" && slug.current == $slug][0]`;

function ProductPageContainer({ productData, preview }) {
  const router = useRouter();
 

  const { data: product = {} } = usePreviewSubscription(query, {
    params: { slug: productData?.slug?.current },
    initialData: productData,
    enabled: preview || router.query.preview !== null,
  });


  const {
    _id,
    title,
    images,
    price,
    blurb,
    body,
    tags,
    conditions,
    categories,
    slug,
  } = product;
  return (
    <ProductPage
      id={_id}
      title={title}
      price={price}
      images={images}
      blurb={blurb}
      body={body}
      tags={tags}
     conditions={conditions}
      categories={categories}
      slug={slug?.current}
    />
  );
}

export async function getStaticProps({ params, preview = false }) {
  const productData = await getClient(preview).fetch(query, {
    slug: params.slug,
  });

  return {
    props: { preview, productData },
  };
}

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    `*[_type == "product" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export default ProductPageContainer;
