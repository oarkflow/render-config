export default function getServiceUrl(serviceType: string, slug: string) {
    // switch serviceName
    slug=slug.toLowerCase();
    switch(serviceType) {
    case "page":
        return `/#/service/webpage/info/${slug}`;
    case "scheduler":
        return `/#/service/scheduler/info/${slug}`;
    case "etl":
        return `/#/service/etl/info/${slug}`;
    case "background":
        return `/#/service/background-service/info/${slug}`;
    case "api":
        return `/#/service/webpage/info/${slug}`;
    default:
        return `/#/app/builder/info/${slug}`;
}
}
  