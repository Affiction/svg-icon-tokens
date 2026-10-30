import { Icon } from './icon/Icon';

export function App() {
  return (
    <>
      <h2>React: &lt;Icon&gt;</h2>
      <section>
        <Icon name="star" className="big red" />
        <button>
          <Icon name="search" /> Search
        </button>
        <button aria-label="Delete">
          <Icon name="trash" />
        </button>
      </section>
    </>
  );
}
