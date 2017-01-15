export function visit(client, path) {
  return client.url(client.lauchUrl + path);
}
