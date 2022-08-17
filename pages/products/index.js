import Error from "next/error";
import { useRouter } from "next/router";
import {usePreviewSubscription, urlFor} from '@lib/sanity'
import {getClient} from "@lib/sanity.server"
import ProductsPage from "../../components/ProductsPage";

const query = `//groq
  *[_type == "product" && defined(slug.current)]
`;

function ProductsPageContainer(props) {
  const { postdata, preview } = props;

  const router = useRouter();

  const { data: products } = usePreviewSubscription(query, {
    initialData: postdata,
    enabled: preview || router.query.preview !== undefined,
  });

  return <ProductsPage products={products} />;
}

export async function getStaticProps({ params = {}, preview = false }) {
  const productsData = await getClient(preview).fetch(query);

  return {
    props: { preview, productsData },
  };
}

export default ProductsPageContainer;
