function formatTimingsEvent (event) {
  if (event == null) {
    return null;
  }

  let applicationLoadTime = null;
  let allComponentData = null;
  let componentTimings = null;

  if (event.Timings != null && Array.isArray(event.Timings)) {
    let findApplicationLoadTime = null;

    event.Timings.forEach((timing) => {
      if (timing != null) {
        if (timing.metricType === 'ALT') {
          findApplicationLoadTime = timing;
        } else if (timing.metricType === 'AllComponents') {
          allComponentData = timing;
        }
      }
    });

    if (findApplicationLoadTime != null) {
      applicationLoadTime = findApplicationLoadTime.value;
    }

    componentTimings = null;

    if (allComponentData != null && allComponentData.data != null) {
      try {
        allComponentData = JSON.parse(allComponentData.data);
      } catch (e) {
        allComponentData = null;
        console.warn('The data provided by Mezzurite could not be parsed.');
      }

      if (allComponentData != null && Array.isArray(allComponentData)) {
        componentTimings = allComponentData.filter((component) => component != null && component.name != null && component.clt != null).map((component) => {
          return {
            componentName: component.name,
            componentLoadTime: component.clt
          };
        }).sort((firstComponent, secondComponent) => {
          return secondComponent.componentLoadTime - firstComponent.componentLoadTime;
        });
      }
    }
  }

  const framework = {
    name: null,
    version: null
  };

  if (event.Framework != null) {
    if (event.Framework.name != null) {
      framework.name = event.Framework.name;
    }

    if (event.Framework.version != null) {
      framework.version = event.Framework.version;
    }
  }

  const time = new Date().toLocaleTimeString();

  return {
    applicationLoadTime,
    componentTimings,
    framework,
    time
  };
}

export default formatTimingsEvent;