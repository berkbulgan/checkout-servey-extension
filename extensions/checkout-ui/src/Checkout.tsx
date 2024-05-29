import {
  ChoiceList,
  Choice,
  Button,
  reactExtension,
  useCartLines,
  View,
  BlockStack,
  Heading,
} from "@shopify/ui-extensions-react/checkout";

import { useState } from "react";

export default reactExtension(
  'purchase.thank-you.block.render',
  () => <Extension />,
);

// export default reactExtension("purchase.checkout.block.render", () => (
//   <Extension />
// ));

function Loading() {
  return <Heading>Submitting feedback...</Heading>;
}

function Completed() {
  return <Heading>Thanks for your feedback!</Heading>;
}

function Survey({ lineItems, setCompleted }) {
  const [selectedItem, setSelectedItem] = useState(
    lineItems[0].id.toString().split("/").at(-1)
  );
  const [loading, setLoading] = useState(false);

  function handleSelect(value) {
    setSelectedItem(value);
  }

  function handleSubmit() {
    console.log(`Submitting form with id of ${selectedItem}`);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
    }, 2000);
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <Heading>Which product did need the most?</Heading>
      <ChoiceList
        name="survey"
        value={selectedItem}
        onChange={handleSelect}
        variant="base"
      >
        <BlockStack>
          {lineItems.map((item, index) => {
            const id = item.id.toString().split("/").at(-1);
            return (
              <Choice key={id} id={id}>
                {item.merchandise.title}
              </Choice>
            );
          })}
        </BlockStack>
      </ChoiceList>
      <Button kind="secondary" onPress={handleSubmit}>
        Submit feedback
      </Button>
    </>
  );
}

function Extension() {
  const cartLines = useCartLines();
  const [completed, setCompleted] = useState(false);

  return (
    <View>
      <BlockStack>
        {cartLines.length > 1 ? (
          completed ? (
            <Completed />
          ) : (
            <Survey lineItems={cartLines} setCompleted={setCompleted} />
          )
        ) : null}
      </BlockStack>
    </View>
  );
}
