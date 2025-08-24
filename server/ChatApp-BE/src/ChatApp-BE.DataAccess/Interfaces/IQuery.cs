namespace ChatApp_BE.DataAccess.Interfaces;
public interface IQuery<T>
{
    IQueryable<T> Query();
}