const transform = (raw) => {
  const dataArray = [];
  const data = [...raw];
  data.reduce((groups, current) => {
    // if this has one item, then it must be the device name
    if (current.length === 1) {
      return groups.concat({
        name: current[0], isNewGroup: true,
      });
    }
    const lastIndex = groups.length - 1;
    // if we had marked this as new group of devices
    // then the next array contains the specifications
    if (groups[lastIndex].isNewGroup) {
      groups[lastIndex] = {
        ...groups[lastIndex],
        isNewGroup: false,
        specification: current,
      };
      return groups;
    }
    // this should contain the values of the specification and
    // therefore we just push another device type
    const currentType = {};
    groups[lastIndex].specification.forEach((spec, specIndex) => {
      currentType[spec] = current[specIndex];
    });
    groups[lastIndex].types = (groups[lastIndex].types || []).concat(currentType);
    return groups;
  }, [])
    .reduce((all, current) => {
      const newData = dataArray.push({
        ...all,
        [current.name]: current.types,
      });
      return newData;
    }, {});

  return dataArray;
};

module.exports = transform;
