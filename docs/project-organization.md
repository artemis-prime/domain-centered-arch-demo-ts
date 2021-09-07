# Project organization

## Domain Centered Architecture
An approach to FE organization that puts the concepts, data ontology, and actions at that make up an app at the core of design and testing. Ideally, this has the effect of decoupling core app logic from any quirks of the presentation tier, such as component life cycle, state management, etc.  The desired result as a "CLIable" version of the app that can be developed and whose integrity can be tested separately from the UI tier. 

## domain: 'the actual app'
As the heading says, this intentionally captures all essentional conceptual and functional aspects of the app.  It contains two things: 

1) A definition of the ***ontology of the app***, in the form of `Interface`s that define data of the domain, as well as ***design patterns and their participants***, including those of interactors / controllers. Note that this much more than just "type-safety" and error prevention, but also to allows and encourages a kind of coding where we think of our core patterns and objects at their most essential level first. Many who work with types start to notice that this is just a much better way to work, as it greatly improves overall clarity, expressiveness, and encapsulation. This is the ***real*** reason to use types! 
2) Services and Interactors organized by domain area that encompass the functionality of the app apart from the UI. At mininum this includes `service`s that encapsulate ***lookup, CRUD, etc.*** of common data types. Ideally, ***interactors encompass state transitions*** in a way that is similar to `REST` API's: one can ask to put the app or a section of it into various states that can then be verified by examining variables, etc.  

### "Look ma, no `state`!" (kind of...)
One might notice that there is no specific area devoted to "state management" in the sense of current React app pratice. There is a reason for this. For the same reason we want to avoid dependence and needless interwovenness with quirks of a particular presentation technology, and seeing as how "state management" is actually one of those, we want to avoid it dictating our architectural choices. 

In practice, state management does in fact live in the `domain`.  This is one of the many ways that `MobX` really shines next to `Redux` and thus why its a prefered tool. It is concieved with this kind of architecture in mind: any field of any object can become `observable` to UI components, without the need for the architecturally intrusive patterns of Reducer, Actions, Dispatchers etc.  One simple defines variables to be observed, and then directly dereferences them in any `render()` method / functional component.

```
// domain/offers/OfferManager.tsx
class OfferManager {
  @observable currentOffer: Offer | undefined = undefined
  // ....
}

// components/offer/OfferView.tsx
const OfferView: React.FC<{}> = () => {
  const offerManager = useOffers() // custom hook for convenience
  return (
    {offerManager.currentOffer ? (
      <h1>Offer: {offerManager.currentOffer.address}</h1>
      {//...}
    ) : (
      <h3>There is no current offer to view related to this property.</h3>
    )}
  )
}
```

There will be much more on `MobX` and how it fits into our desired architectural approach when we add an example implimentation in a later PR / lesson file.

## components: stupid and general
Components are all the widgets, cards, etc that display and interact with the domain objects of the app. They do not (in most cases) contain any direct data access or even encode functional info such as "this widget links to this page".  The just provide as simple a way to accomplish the core tasks of displaying and interacting with the apps objects.  

### If there is more than one file, use a ***PascalCase directory*** per component
So if `OfferView` contains several files, they'd appear like so:

```
components/OfferView/
              OfferView.tsx
              offerView.scss
              SubcomponentFoo.tsx
              offerViewHelpers.ts
              stateAbbreviationsForOffers.json
```

Only the main one is referenced in the `index` for `components` and is thus visible to the outside world:

```
// components/index.ts

export { default as OfferView } from './OfferView/OfferView'
//...
```

Note that anything that is ***not a React component***, such as `scss` files, utilities, helpers are ***camalCase to distinguish them*** from components.

### "page components"
Any components that only appear on one page of the app should live with that page, not in the `component`s tree.  (cf: current `pages/offer/OfferMessageCard`).  However, once you are "repeating yourself", it is better to move the component to this tree. This keeps things tidy by keeping a clear line between general and specific.

### View, Card, Modal, etc
The core function of a component should be kept as separate from it's visual "container" as possible. Toward that end, it's often best and most practical for most components to start as a `View` ie, something agnostic about where and how it appears (in a `Card`, `Modal` or whatever else).  That way various presentation forms can simply wrap the component as needed.  

```
import { MessagesView } from 'components' // main functionality

const MessagesCard = () => (
  <Card>
    <MessagesView/>
  </Card>
)

```

In practice, this is often the level at which the "specificity" of the component, ie, its link to the domain also lives.  As in the current code:

```
import { MessagesView } from 'components' 
import { useOfferMessagesService } from 'domain/offer/OfferMessagesService'

const OfferMessagesCard: React.FC<{
  offerId: string
}> = ({
  offerId
}) => {
  // connection to the data.
  // What makes this an *Offer*MessagesCard! 
  const source = useOfferMessagesService() 
  return (
    <Card>
      <MessagesView 
        messagesSource={source} 
        messagesKey={offerId}
        {//...}
    </Card>
  )
}
```


