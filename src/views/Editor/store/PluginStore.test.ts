import { SubscriptionPlanEnum } from 'enums/SubscriptionPlanEnum';
import EditorViewStore from './EditorViewStore';
import waitAsync from 'utils/waitAsync';
import ProjectStore from 'models/Project/ProjectStore';
import ProjectEnum from 'enums/ProjectEnum';

const responseHeader = { headers: { 'content-type': 'application/json' } };

describe('EditorViewStore pluginStore', () => {
  it('Own components for plugin', async () => {
    const response = {
      success: true,
      data: {
        subscribed: { planId: SubscriptionPlanEnum.START_UP }
      }
    }
    fetchMock.mockResponseOnce(JSON.stringify(response), responseHeader);
    let store = new EditorViewStore('qwerty');
    expect(store.pluginStore.components.length).toBe(0);

    response.data.subscribed.planId = SubscriptionPlanEnum.SILVER;
    fetchMock.mockResponseOnce(JSON.stringify(response), responseHeader);
    store = new EditorViewStore('qwerty');
    await waitAsync(100);
    store.pluginStore.setComponents([ProjectStore.createEmpty(ProjectEnum.COMPONENT)]);
    expect(store.pluginStore.components.length).toBe(1);

    response.data.subscribed.planId = SubscriptionPlanEnum.GOLD;
    fetchMock.mockResponseOnce(JSON.stringify(response), responseHeader);
    store = new EditorViewStore('qwerty');
    await waitAsync(100);
    store.pluginStore.setComponents([ProjectStore.createEmpty(ProjectEnum.COMPONENT)]);
    expect(store.pluginStore.components.length).toBe(1);

    response.data.subscribed.planId = SubscriptionPlanEnum.START_UP;
    fetchMock.mockResponseOnce(JSON.stringify(response), responseHeader);
    store = new EditorViewStore('qwerty');
    await waitAsync(100);
    store.pluginStore.setComponents([ProjectStore.createEmpty(ProjectEnum.COMPONENT)]);
    expect(store.pluginStore.components.length).toBe(0);
  });
})
